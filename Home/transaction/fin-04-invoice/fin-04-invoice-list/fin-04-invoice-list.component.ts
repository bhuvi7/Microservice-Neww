import { Component, OnInit,ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'fin-04-invoice-list',
    templateUrl: './fin-04-invoice-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class Fin04InvoiceListComponent implements OnInit {
    ngOnInit() { }
    constructor(private router: Router, private route: ActivatedRoute) { }


}