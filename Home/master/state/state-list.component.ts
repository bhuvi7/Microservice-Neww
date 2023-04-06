import { Component,OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MasterService } from '../master.service';
import { State } from "../model/state";
@Component({
    selector:"state-list",
    templateUrl:"state-list.component.html"
})
export class StateListComponent implements OnInit{
    public states: Array<State>;
    public loading: Boolean = true;
    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 10
    };
    dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(public masterService: MasterService, public router: Router) { }

    ngOnInit() {
        this.states = Array<State>();
        this.masterService.getAllState().subscribe(x => {
            this.states = x;
            this.loading = false;
            this.dtTrigger.next();
        });

    }

    detailPage(user) {
        this.router.navigateByUrl("/master/state/detail/" + user.id);
    }

    // confirmAlert() {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: 'Once deleted, you will not be able to recover this User!',
    //         type: 'warning',
    //         showCloseButton: true,
    //         showCancelButton: true
    //     }).then((willDelete) => {
    //         if (willDelete.dismiss) {
    //             //   Swal.fire('', 'Your imaginary file is safe!', 'error');
    //         } else {
    //             //this.deleteUser(user);
    //             Swal.fire('', 'User has been deleted successfully !!!', 'error');
    //         }
    //     });
    // }

    //   deleteUser(user) {

    //     this.userManagementService.deleteUser(user).subscribe((x)=>{
    //       this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         dtInstance.destroy();
    //         this.dtTrigger.next();
    //         this.getAllUser();
    //       });
    //     });

    //   }


    // ngAfterViewInit(): void {
    //     this.dtTrigger.next();
    // }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }


}