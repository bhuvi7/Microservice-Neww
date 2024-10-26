import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subject } from 'rxjs';
import { Fin02aInvoiceService } from '../../../fin-02a-invoice/fin-02a-invoice-service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
    selector: "fin-07-create-list",
    templateUrl: "./fin-07-create-list.component.html"
})
export class Fin07CreateListComponent implements OnInit {

    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 10
    };
    dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    public listDatas: any;
    public buttonEnableBoolean: Boolean;
    public selectedValue: Boolean;
    public clinicCode: any;
    public month: any;
    public year: any;
    public invoiceType: string;
    public cardTitle: string;
    public filterDatas: any;
    public stateFilter: string = "0";
    public districtFilter: string = "0";
    public stateFilterDatas: Array<any>;
    public districtFilterDatas: Array<any>;
    public loading: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute, private fin02aService: Fin02aInvoiceService) { }

    ngOnInit() {
        // this.filterDatas = []
        // this.fin02aService.fetchStateDetails().subscribe(x => {
        //     this.stateFilterDatas = x;
        // })
        this.buttonEnableBoolean = true
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    customRadio(id) {
        return "customRadio" + id
    }

    buttonEnable(clinicCode, month, year) {
        this.clinicCode = clinicCode
        this.month = month
        this.year = year
        this.buttonEnableBoolean = false
    }



    // common filter fields ----
    selectedIds(selectedIds) {
        this.loading = true
        if (this.route.params['_value']['_indicator'] != "undefined") {
            if (this.route.params['_value']['_indicator'] == "new") {
                this.fin02aService.fetchDataForFin07CreateList(selectedIds).subscribe(fin => {

                    this.assingDataFromDb(fin, selectedIds.stateId);
                    this.loading = false

                })
            } else {
                this.fin02aService.fetchDataForFin07CreateListOlder(selectedIds).subscribe(fin => {
                    this.assingDataFromDb(fin, selectedIds.stateId);
                    this.loading = false
                })
            }
        }
    }
    assignDatas(fin: any) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
            this.filterDatas = fin;
        })
    }
    // check for state id 8 if exists loop thru it and set clinictypeid else just assign the data from db
    assingDataFromDb(fin: any, stateId) {
        if (fin.length == 0) {
            Swal.fire('', 'All the clinics under this state/district is Approved,check Approved process', 'info');
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
                this.filterDatas = [];
            });
            this.loading = false
        } else {
            if (parseInt(stateId) == 8) {

                fin.forEach((element, i) => {


                    if (element.stateName == 'SARAWAK') {
                        if (element.clinicTypeId == 1) {
                            element.clinicTypeCode = 'PKB'
                        }
                        if (element.clinicTypeId == 2) {
                            element.clinicTypeCode = 'PPB'
                        }
                    }
                    if (fin.length - 1 == i) {
                        this.assignDatas(fin);
                        this.loading = false
                    }
                });
            } else {
                this.assignDatas(fin);
                this.loading = false
            }
        }
        // this.loading = false
    }


    radioSelect() {

        this.router.navigateByUrl('transaction/fin-02a-invoice/fin-07-create/' + this.clinicCode + '/' + this.month + '/' + this.year);
    }

}