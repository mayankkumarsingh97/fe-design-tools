import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environment/environment';
import { SendotpService } from '../auth/sendotp.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, debounce } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { MyUtils } from '../utils/comman';
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
  selector: 'app-tool-drawing-retrival',
  templateUrl: './tool-drawing-retrival.component.html',
  styleUrls: ['./tool-drawing-retrival.component.css'],
  viewProviders: [MyUtils]
})

export class ToolDrawingRetrivalComponent {
  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  HOST = environment.host
  tcode_json = [
    { tcode: "", value: "", desc: "" },
  ];
  httpClient: any;

  _make_LocalStorage_empty() {
    localStorage.removeItem("too_auth_user");
    window.location.href = ''
  }

  constructor(private getSearchCode: SendotpService,
    private router: Router, private http: HttpClient, private utils: MyUtils) {
  }
  _plant_1 = ''
  _plant_2 = ''
  _plant_3 = ''
  _value = ''
  viewValue = ''

  pokemonControl = new FormControl('');
  pokemonGroups: AggGroup[] = [];

  // **-------------------------------------------------------
  //  Debounce Search in Application
  // -------------------------------------------------------**
  results$!: Observable<any>;
  subject = new Subject()
  ngOnInit(): void {
    this._getPlant_menu()
    // this.utils._getPlant_menu();
    this.results$ = this.subject.pipe(
      debounceTime(450),
      map(searchText => {
        const uploadUrl = `${this.HOST}/api/itemcode/search/${searchText}`;
        fetch(uploadUrl, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json()).
          then(res => {
            this.tcode_json = res.data
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





  _multi_select_data: any = ''
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




  _api_call(id: any) {
    const formData = {
      plant_id: id,
    }
    const uploadUrl = `${this.HOST}/api/agg/plant`;
    fetch(uploadUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this.aggregates = res.data
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
  }



  plant = ''
  GetSelectedPlant(event: any) {
    const ye = event.value
    this.property.plant = ye.toString()
    if (event.value == "Plant1") {
      const id = 1
      this._api_call(id);
    }
    if (event.value == "Plant2") {
      const id = 2
      this._api_call(id);
    }
    if (event.value == "Plant3") {
      const id = 3
      this._api_call(id);
    }
  }




  searchTcodesetValue(event: any) {
    this.property.t_code = event.value
  }


  selectedPlants: any[] = [];
  selectedAggregates: any[] = [];

  plantsList: any = [
    { id: 1, name: 'Plant1' },
    { id: 2, name: 'Plant2' },
    { id: 3, name: 'Plant3' },
  ];

  aggregates: any = [
    { aggregate_id: 1, name: 'Tractor' },
    { aggregate_id: 2, name: 'Engine' },
    { aggregate_id: 3, name: 'Transmission' },
  ];



  toolRetrivalFilter() {
    this.callForFilter(this.property);
    // this.clearSelection()
  }
  property = {
    plant: "",
    agg: "",
    t_code: "",
    limit: "",
  }

  agg = ''
  GetSelectedDivision(event: any) {
    const ye = event.value
    this.property.agg = ye.toString()
  }

  // Function to clear the selected value
  clearSelection(): void {
    this.property.t_code = '';
  }

  all_data_fst_t: any
  _to_table: Boolean = false
  ye: any
  _not_found: boolean = false
  _no_data: boolean = false
  _loading: boolean = false
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
    this._loading = true;
    const uploadUrl = `${this.HOST}/api/tools/data/search`;
    fetch(uploadUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        if (this._loading) {
          this._no_data = false
        }
        this._loading = false
        this.totalItems = res?.totalRows[0]?.TotalCnt
        if (!res?.totalRows[0]?.TotalCnt) {
          this._not_found = true
        } else {
          this._not_found = false
        }
        this.all_data_fst_t = res.dataRows
        if (res.dataRows.length > 0) {
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

  }



  pageSize = 20;   // items to display per page
  pageSizeOptions: any[] = [20, 40, 80];
  currentPageIndex = 1;
  totalItems = 0;



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
    this.router.navigate(['admin-dashboard']);
  }




}
