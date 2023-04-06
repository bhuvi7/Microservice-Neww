import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { Fin11InvoiceService } from '../fin-11-invoice-service';
// import { toWords } from 'number-to-words';

@Component({
  selector: 'fin-11-approved-list',
  templateUrl: 'fin-11-approved-list.component.html',
  providers: [NgbModalConfig, NgbModal]
})

export class Fin11ApprovedListComponent implements OnInit {

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10
  };
  dtTrigger: Subject<any> = new Subject();

  public invoiceDatas: any;
  public buttonEnableBoolean: Boolean;
  public selectedValue: Boolean;
  public createData: any;
  public modalBodyContent;
  public approveData;
  public stateName= "";
  public districtName="";
  public code="";
  public filterDatas: any;
  public stateFilter: string = "";
  public districtFilter: string = "";
  public stateFilterDatas: Array<any>;
  public districtFilterDatas: Array<any>;
  public loading: Boolean = true;

  constructor(private router: Router, private fin11Service: Fin11InvoiceService,
    config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.filterDatas = []
    this.fin11Service.fetchDataForFin11Approved(7, "APPROVED BY MOH").subscribe(x => {
      this.invoiceDatas = x;
      this.invoiceDatas.forEach(element => {
        element.approved = true
        this.filterDatas.push(element)
      });
      this.dtTrigger.next();
      this.loading = false;
    })
    
    
    //testdata
    // this.filterDatas=
    //     [{id:"1", month:"8", year:"2020", stateName: "JOHOR", districtName: "JHR", code:"fin05aq", status: "approved"},
    //     { id:"2",month:"8", year:"2020", stateName: "JOHOR", districtName: "JHR", code:"fin05ar", status: "not approved"},
    //     { id:"3",month:"8", year:"2020", stateName: "JOHOR", districtName: "JHR", code:"fin05aqD", status: "moh approved"},]
    //     
    //     this.loading = false;

        

    this.fin11Service.fetchStateDetails().subscribe(x => {
      this.stateFilterDatas = x;
    })
    this.buttonEnableBoolean = true
  }

  handleForm(event) {
    switch (event.target.id) {
      case "state":
        this.stateFilter = event.target.value;
        this.districtFilter = "";
        this.districtFilterDatas = this.stateFilterDatas.find(state => state.stateName == event.target.value).districts
        this.filterFunction();
        break;
      case "district":
        this.districtFilter = event.target.value;
        this.filterFunction();
        break;
      default:
        break;
    }
  }

  filterFunction() {
    this.filterDatas = []
    if (this.stateFilter !== "" && this.districtFilter == "") {
      this.invoiceDatas.forEach(element => {
        if (element.stateName == this.stateFilter) {
          this.filterDatas.push(element)
        }
      });
    } else if (this.stateFilter !== "" && this.districtFilter !== "") {
      this.invoiceDatas.forEach(element => {
        if (element.stateName == this.stateFilter && element.districtName == this.districtFilter) {
          this.filterDatas.push(element)
        }
      })
    }
  }

  resetFilter() {
    this.stateFilter = ""
    this.districtFilter = ""
    this.districtFilterDatas = []
    this.filterDatas = []
    this.invoiceDatas.forEach(element => {
      this.filterDatas.push(element)
    })
  }

 
  customRadio(id) {
    return "customRadio" + id
  }

  openModal(content, modalContent, data) {
    this.modalBodyContent = modalContent
    this.modalService.open(content);
    this.approveData = data;
  }

  closeModal() {
    if (this.modalBodyContent == 'Approve') { this.approve(this.approveData); }
  }

  approve(data) {
    if (data.status == 'IN INTERNAL APPROVAL') { data.status = 'FOR APPROVAL TO MOH' }
    else if (data.status == 'FOR APPROVAL TO MOH') { data.status = 'APPROVED BY MOH' }
    this.fin11Service.updateFin11Status(data).subscribe(x => {
      this.invoiceDatas.forEach(element => {
        if (element.id == data.id) {
          if (element.status == 'IN INTERNAL APPROVAL' || element.status == 'FOR APPROVAL TO MOH') {
            element.approved = false
          } else {
            element.approved = true;
          }
        }
      });
    })
  }

  navigateToApproval(data) {
    this.router.navigateByUrl('transaction/fin-11-invoice/fin-11-approve/' + data);
  }
}