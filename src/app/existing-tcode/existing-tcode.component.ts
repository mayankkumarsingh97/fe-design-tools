import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SendotpService } from '../auth/sendotp.service';
import { Router } from '@angular/router';
// import {Component} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { environment } from '../environment/environment';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateRange } from '@angular/material/datepicker';
import Swal from 'sweetalert2'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { map, debounceTime } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

interface Agg {
  value: string;
  viewValue: string;
}

interface AggGroup {
  disabled?: boolean;
  name: string;
  agg: Agg[];
}

@Component({
  selector: 'app-existing-tcode',
  templateUrl: './existing-tcode.component.html',
  styleUrls: ['./existing-tcode.component.css'],

})

export class ExistingTCodeComponent implements OnInit {
  constructor(private getSearchCode: SendotpService, private router: Router) {
    this.selectedCar = 0;
  }
  pokemonControl = new FormControl('');
  pokemonGroups: AggGroup[] = [];




  _make_LocalStorage_empty() {
    localStorage.removeItem("too_auth_user");
    this.router.navigate(['']);
  }

  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  HOST = environment.host
  selectedDate = new FormControl(Range);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  _confermation_Inactive(_master_id: any) {
    const formData = {
      tools_master_id: `${_master_id}`,
      active: 0
    }

    Swal.fire({
      title: "Do you want to Inactive the data ?",
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then((e) => {
      if (e.isConfirmed === true) {
        const inActiveUrl = `${this.HOST}/api/tools/design/status`;
        fetch(inActiveUrl, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json()).
          then(res => {
            if (res.error == false) {
              Swal.fire({
                title: res.msg,
                icon: 'success',
                confirmButtonText: 'Done',
              }).then((e) => {
                if (e.isConfirmed === true) {
                  this.callForFilter(this.property);
                }
              })
            }
            if (res.error == true) {
              Swal.fire({
                title: res.msg,
                icon: 'error',
                confirmButtonText: 'Done',
              })
            }
          }).catch((err) => {
            console.log(err)
          })
      }
    }).catch((e) => {
      console.log(e)
    })
  }


  goBackToPrevPage() {
    window.history.back();
  }




  all_data_fst_t: any
  _no_data: boolean = false
  _the_total_cout = ''

  callForFilter(obj: any) {
    const formData = {
      tcode: obj.t_code,
      plant: `${obj.plant}`,
      div: `${obj.agg}`,
      fdt: ``,
      tdt: ``,
      page: this.currentPageIndex,
      limit: this.pageSize | obj.limit
    }
    // alert(JSON.stringify(formData))
    const uploadUrl = `${this.HOST}/api/tools/data/search`;
    fetch(uploadUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this.all_data_fst_t = res.dataRows
        // ---** setTotalCoutForPagination  **----
        this.totalItems = res?.totalRows[0]?.TotalCnt
        if (res.dataRows.length == 0) {
          this._no_data = true
        }
        else {
          this._no_data = false
        }
      }).catch((err) => {
        console.log(err)
      })
  }


  _the_file_path = ''
  callForPic(res: any, file_type: any) {
    var formData = {
      file_pdf: 0,
      file_dwg: 0,
      file_3d: 0,
      file_photo: 0,
    }
    console.log(res)
    if (file_type == 'pdf') {
      formData.file_pdf = res
    }
    if (file_type == 'dwg') {
      formData.file_dwg = res
    }
    if (file_type == '3d') {
      formData.file_3d = res
    }
    if (file_type == 'photo') {
      formData.file_photo = res
    }
    // alert(JSON.stringify(formData))
    const uploadUrl = `${this.HOST}/api/tools/file`;
    fetch(uploadUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        const fileUrl = res[0]?.upload_path;
        window.open(fileUrl, '_blank');
      }).catch((err) => {
        console.log(err)
      })
  }

  tcode_json = [
    { tcode: "", value: "", desc: "" },
  ];

  selectedCar: number;

  description = ''

  // changeFn(event: any) {
  //   this.description = event.tcode
  //   this.getSearchCode.getAllTcode(event.target.value).subscribe((res: any) => {
  //     this.tcode_json = res?.data
  //   })
  // }

  selectedPlants: any[] = [];
  selectedAggregates: any[] = [];

  plantsList: any = [
    { id: 1, name: 'Plant1' },
    { id: 2, name: 'Plant2' },
    { id: 3, name: 'Plant3' },
  ];

  aggregates = [
    { id: 1, name: 'Tractor' },
    { id: 2, name: 'Engine' },
    { id: 3, name: 'Transmission' },
  ];


  property = {
    plant: "",
    agg: "",
    t_code: "",
    limit: ""
  }

  searchTcodesetValue(event: any) {
    this.property.t_code = event?.value
    this.callForFilter(this.property)
  }

  GetSelectedPlant(event: any) {
    const ye = event.value
    this.property.plant = ye.toString()
    this.callForFilter(this.property)
  }

  GetSelectedDivision(event: any) {
    const ye = event.value
    console.log(ye.toString())
    this.property.agg = ye.toString()
    this.callForFilter(this.property)
  }

  pageSize = 20;   // Number of items to display per page
  pageSizeOptions: any[] = [20, 40, 80];
  currentPageIndex = 1;
  totalItems = 0

  onPageChange(event: any) {
    this.currentPageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.property.limit = event.pageSize
    this.callForFilter(this.property)
  }

  navigateToNextPage() {
    this.currentPageIndex++;
    this.callForFilter(this.property)
  }

  navigateToPreviousPage() {
    this.currentPageIndex--;
    this.callForFilter(this.property)
  }

  // **-------------------------------------------------------
  //  Debounce Search in Application
  // -------------------------------------------------------**
  results$!: Observable<any>;
  subject = new Subject()

  ngOnInit(): void {
    this.callForFilter(this.property);
    this._getPlant_menu();

    this.results$ = this.subject.pipe(
      debounceTime(550),
      map(searchText => {
        const uploadUrl = `${this.HOST}/api/itemcode/search/${searchText}`;
        fetch(uploadUrl, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json()).
          then(res => {
            this.tcode_json = res?.data
            this.description = res?.desc
          }).catch((err) => {
            console.log(err)
          })
      })
    )

    this.results$.subscribe((r: any) => { })
  }

  search(event: any): void {
    const searchText = event.target.value
    this.subject.next(searchText)
  }


  _getPlant_menu() {
    const uploadUrl = `${this.HOST}/api/agg/plant/`;
    fetch(uploadUrl, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this.pokemonGroups = res.data[0]
      }).catch((err) => {
        console.log(err)
      })
  }
}



