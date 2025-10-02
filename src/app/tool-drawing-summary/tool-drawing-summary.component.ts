import { Component, OnInit } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../environment/environment';
import { SendotpService } from '../auth/sendotp.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


interface Agg {
  value: string;
  viewValue: string;
  // plant_id: number,
  // aggregate_id: number
}

interface AggGroup {
  disabled?: boolean;
  name: string;
  agg: Agg[];
}

@Component({
  selector: 'app-tool-drawing-summary',
  templateUrl: './tool-drawing-summary.component.html',
  styleUrls: ['./tool-drawing-summary.component.css'],
})

export class ToolDrawingSummaryComponent implements OnInit {
  pokemonControl = new FormControl('');
  pokemonGroups: AggGroup[] = [];

  _make_LocalStorage_empty() {
    localStorage.removeItem("too_auth_user");
    this.router.navigate(['']);
  }

  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  HOST = environment.host
  tcode_json = [
    { tcode: "T10010540 : CLAMPAS PER DWG. NO.N705A-EF-10/3", value: "T10010540", desc: "CLAMPAS PER DWG. NO.N705A-EF-10/3" },
  ];

  constructor(private getSearchCode: SendotpService,
    private router: Router) { }



  ngOnInit() {
    this._getPlant_menu();
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


  description = ''
  changeFn(event: any) {
    this.description = event.tcode
    this.getSearchCode.getAllTcode(event.target.value).subscribe((res: any) => {
      this.tcode_json = res.data
    })
  }

  // t_code = ''
  searchTcodesetValue(event: any) {
    this.property.t_code = event.value
    // console.log(this.t_code)
  }


  selectedPlants: any[] = [];
  selectedAggregates: any[] = [];
  status: any[] = [];

  statusList: any = [
    { id: 0, name: 'Inactive' },
    { id: 1, name: 'Active' },
  ];

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

  startDateControl = new FormControl();
  endDateControl = new FormControl();


  _start_date: any = ''
  _end_date: any
  getSelectedDates(): void {
    const startDate = this.startDateControl.value;
    const endDate = this.endDateControl.value;
    const startDate_O = new Date(startDate);
    const endDate_O = new Date(endDate);
    // ------Start Date Sepration-------
    const startYear = startDate_O.getFullYear()
    const startMonth = startDate_O.getMonth() + 1;
    const startDay = startDate_O.getDate();
    // ------End Date Sepration-------
    const endYear = endDate_O.getFullYear()
    const endMonth = endDate_O.getMonth() + 1;
    const endDay = endDate_O.getDate();

    let _f_dt = `${startYear}-${startMonth}-${startDay}`
    let _t_dt = `${endYear}-${endMonth}-${endDay}`

    this._start_date = _f_dt
    this._end_date = _t_dt

    if (_f_dt == "1969-12-31" || _f_dt == "1970-1-1"
      && _t_dt == "1969-12-31" || _t_dt == "1970-1-1") {
      this._start_date = '';
      this._end_date = ''
    }
  }

  toolRetrivalFilter() {
    this.callForFilter(this.property);
  }
  property = {
    plant: "",
    agg: "",
    t_code: "",
    _status: "1",
    limit: ""
  }

  plant = ''
  GetSelectedPlant(event: any) {
    const ye = event.value
    this.property.plant = ye.toString()
  }

  agg = ''
  GetSelectedDivision(event: any) {
    const ye = event.value
    // alert(ye)
    //console.log(ye.toString())
    this.property.agg = ye.toString()
  }

  getStatus(event: any) {
    const status = event.value
    this.property._status = status
  }

  selectedDate = ''
  onDateSelected(e: any): void {
    this.startDateControl.value
  }

  all_data_fst_t: any
  _the_total_cout = ''
  _no_data: boolean = false
  _not_found: boolean = false

  callForFilter(obj: any) {
    this.getSelectedDates();
    const formData = {
      tcode: obj.t_code,
      plant: `${obj.plant}`,
      div: `${obj.agg}`,
      fdt: `${this._start_date}`,
      tdt: `${this._end_date}`,
      page: this.currentPageIndex,
      limit: obj.limit | this.pageSize,
      status: `${obj._status}`
    }
    //alert(JSON.stringify(formData))
    const uploadUrl = `${this.HOST}/api/tools/data/search`;
    fetch(uploadUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this.totalItems = res?.totalRows[0]?.TotalCnt
        if (!res?.totalRows[0]?.TotalCnt) {
          this._not_found = true
        } else {
          this._not_found = false
        }
        if (res?.totalRows[0]?.TotalCnt > 0) {
          this._no_data = true
        }
        else {
          this._no_data = false
        }
        this.all_data_fst_t = res.dataRows
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
  }


  // Pagination Logic
  pageSize = 50;   // Number of items to display per page
  pageSizeOptions: any[] = [50, 100, 150, 200, 300, 500];
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


  goBackToPrevPage() {
    window.history.back();
  }

  _disp_summar_info(_info_object: any) {
    let htmlContent = `
      <div class="d-flex justify-content-evenly">
        <div>
          <b>Added By</b>
        </div>
        <div>
          <b>${_info_object.created_user}</b> 
          on <b>${_info_object.created_at}</b>
        </div>
      </div>`;

    if (_info_object.updated_user !== null) {
      htmlContent += `
      <div class="d-flex justify-content-around">
        <div>
          <b>Modified By</b>
        </div>
        <div>
          <b>${_info_object.updated_user}</b> 
          on <b>${_info_object.updated_at}</b> 
        </div>
      </div>`;
    }

    Swal.fire({
      title: 'Change Log',
      html: htmlContent,
      icon: 'info',
      confirmButtonText: 'OK',
      imageWidth: 400,
      imageHeight: 200,
    });
  }

  exportToPdf() {
    let formData = {
      div: this.property.agg,
      fdt: `${this._start_date}`,
      tdt: `${this._end_date}`,
      status: this.property._status,
      uid: this.userData[0].user_id,
    }

    function objectToQueryString(formData: any) {
      const keyValuePairs = [];
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const value = formData[key];
          const encodedKey = encodeURIComponent(key);
          const encodedValue = encodeURIComponent(value);
          keyValuePairs.push(`${encodedKey}=${encodedValue}`);
        }
      }
      return keyValuePairs.join('&');
    }
    const qString = objectToQueryString(formData);
    const uploadUrl = `${this.HOST}/api/tools/data/excel/download?${qString}`;
    window.open(uploadUrl)
  }
}
