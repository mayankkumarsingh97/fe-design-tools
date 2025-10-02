import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Pipe } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { SendotpService } from '../auth/sendotp.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { debounce, fromEvent } from 'rxjs';
import { environment } from '../environment/environment';
import { map, debounceTime } from 'rxjs';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
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
  selector: 'app-new-tcode',
  templateUrl: './new-tcode.component.html',
  styleUrls: ['./new-tcode.component.css'],

})

export class NewTCodeComponent implements OnInit {
  HOST = environment.host;
  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  selectedValuesControl = new FormControl();
  // Dip Injection 
  constructor(private http: HttpClient, private getSearchTcode: SendotpService, private router: Router) { }

  tcode_json = [
    {
      tcode: "T10010540 : CLAMPAS PER DWG. NO.N705A-EF-10/3",
      value: "T10010540", desc: "CLAMPAS PER DWG. NO.N705A-EF-10/3"
    },
  ];
  selectedPlants: any[] = [];
  selectedAggregates: any[] = [];

  plantsList: any = [
    { id: 1, name: 'Plant1' },
    { id: 2, name: 'Plant2' },
    { id: 3, name: 'Plant3' },
  ];




  pokemonControl = new FormControl('');
  pokemonGroups: AggGroup[] = [];




    // **-------------------------------------------------------
  //  Debounce Search in Application
  // -------------------------------------------------------**
  results$!: Observable<any>;
  subject = new Subject()

  ngOnInit(): void {
    this._getPlant_menu()

    this.results$ = this.subject.pipe(
      debounceTime(400),
      map(searchText => {
        const uploadUrl = `${this.HOST}/api/itemcode/search/${searchText}`;
        fetch(uploadUrl, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json()).
          then(res => {
            this.tcode_json = res.data
            this.description = res.desc
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

  GetSelectedPlant(event: any) {
    const _multi_select_data = event.value
    this._api_call(_multi_select_data)
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
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
  }

  // -----------*** -------------
  // Add Tcode form validation
  // -----------*** -------------
  addTcodeForm: any = new FormGroup({
    // plants: new FormControl('', [Validators.required]),
    agg: new FormControl('', [Validators.required,]),
    selection: new FormControl('', [Validators.required]),
    upload_pdf_file: new FormControl('', [Validators.required]),
    upload_dwg_file: new FormControl(''),
    upload_3d_file: new FormControl(''),
    upload_too_pic: new FormControl(''),
    item_desc: new FormControl('')

  })

  get plants() {
    return this.addTcodeForm.get('plants')
  }

  get agg() {
    return this.addTcodeForm.get('agg')
  }

  get selection() {
    return this.addTcodeForm.get('selection')
  }
  get upload_pdf_file() {
    return this.addTcodeForm.get('upload_pdf_file')
  }
  get upload_dwg_file() {
    return this.addTcodeForm.get('upload_dwg_file')
  }
  get upload_3d_file() {
    return this.addTcodeForm.get('upload_3d_file')
  }
  get upload_too_pic() {

    return this.addTcodeForm.get('upload_too_pic')
  }

  file_pdf_id = '0'
  file_dwg_id = '0'
  file_3d_id = '0'
  file_photo_id = '0'


  progressBar = false

  addTcodeFormFn() {
    this.addTcodeForm.value.selection = this.t_code
    this.addTcodeForm.value.agg = this.addTcodeForm.controls.agg.value
    // this.addTcodeForm.value.plants = this.addTcodeForm.controls.plants.value
    this.addTcodeForm.value.upload_pdf_file = this.file_pdf_id
    this.addTcodeForm.value.upload_dwg_file = this.file_dwg_id
    this.addTcodeForm.value.upload_3d_file = this.file_3d_id
    this.addTcodeForm.value.upload_too_pic = this.file_photo_id
    // ----------------------------------------------
    // tCode api api trigger only form is validated 
    // ----------------------------------------------
    if (this.addTcodeForm.invalid) {
      Swal.fire({
        title: "Please select all the fields!",
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
    if (!this.addTcodeForm.invalid) {
      const formData = {
        item_code: this.t_code,
        item_desc: this.description,
        // plant: this.addTcodeForm.controls.plants.value?.toString(),
        division: this.addTcodeForm.controls.agg.value?.toString(),
        file_pdf_id: this.file_pdf_id,
        file_dwg_id: this.file_dwg_id,
        file_3d_id: this.file_3d_id,
        file_photo_id: this.file_photo_id,
        uid: this.userData[0].user_id
      }
      //alert(JSON.stringify(formData))

      const uploadUrl = `${this.HOST}/api/tools/design/add`;
      fetch(uploadUrl, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()).
        then(res => {
          console.log(res, 'response')
          // console.log(this.userData, 'userData')

          if (res.error == false) {
            Swal.fire({
              title: res.msg,
              icon: 'success',
              confirmButtonText: 'Done'
            })
            setTimeout(() => {
              this.router.navigate(['existingtcode']);
            }, 2000)
          }
          if (res.error == true) {
            Swal.fire({
              title: res.msg,
              icon: 'error',
              confirmButtonText: 'ok'
            })
            this.router.navigate(['newtcode'])
          }
        }).catch((err) => {
          console.log(err)
        })
    }
  }

  comboChange(event: any) {
    console.log(event)
  }


  description = ''
  // searchTcodeApiFn(event: any) {
  //   this.description = event.tcode
  //   this.getSearchTcode.getAllTcode(event.target.value).
  //     subscribe((res: any) => {
  //       this.tcode_json = res.data
  //       this.description = res.desc
  //     })
  // }

  t_code = ''
  searchTcodesetValue(event: any) {
    this.t_code = event.value
    this.description = event.desc
  }


  onValueChanged(event: any): void {
    // Cast the event target to an array of items

  }

  goBackToPrevPage() {
    window.history.back();
  }

  progress: number[] = [];
  fileNames: string[] = [];


  onFileSelected(event: any, index: number, folder: string) {
    const file = event.target.files[0];
    if (file) {
      this.fileNames[index] = file.name;
      this.uploadFile(file, index, folder);
    }
  }



  uploadFile(file: any, index: number, folder: string) {
    this.progressBar = true
    const formData = new FormData();
    formData.append('uploadfile', file);
    formData.append('entity', `${folder}`);
    formData.append('uid', `${this.userData[0].user_id}`);

    const uploadUrl = `${this.HOST}/upload`;
    fetch(uploadUrl, {
      method: "POST",
      body: formData,
      // headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this.progressBar = false
        if (res.error == true) {
          Swal.fire({
            title: res.msg,
            icon: 'error',
            confirmButtonText: 'Done'
          })
        }
        if (res.error == false) {
          Swal.fire({
            title: res.msg,
            icon: 'success',
            confirmButtonText: 'Done'
          })

          if (index == 0) {
            this.file_pdf_id = res.data.file_id
          }
          if (index == 1) {
            this.file_dwg_id = res.data.file_id
          }
          if (index == 2) {
            this.file_3d_id = res.data.file_id
          }
          if (index == 3) {
            this.file_photo_id = res.data.file_id
          }
        }
      }).catch((err) => {
        console.log(err)
      })
  }





  _make_LocalStorage_empty() {
    localStorage.removeItem("too_auth_user");
    // window.location.href = '/';
    this.router.navigate(['']);
  }
























}
