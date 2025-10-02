// import { Component } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Pipe } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { SendotpService } from '../auth/sendotp.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { debounce, fromEvent } from 'rxjs';
import { environment } from '../environment/environment';
import { map, debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ExistingTCodeComponent } from '../existing-tcode/existing-tcode.component';

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
  selector: 'app-edit-t-code',
  templateUrl: './edit-t-code.component.html',
  styleUrls: ['./edit-t-code.component.css']
})
export class EditTCodeComponent implements AfterViewInit {
  _glogbal_dynamic_id: any
  HOST = environment.host;
  userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  selectedValuesControl = new FormControl();

  aggregatorControl = new FormControl();
  plantAggGroups: AggGroup[] = [];

  // Dip Injection 
  constructor(
    //private formBuilder: FormBuilder,
    private http: HttpClient,
    private getSearchTcode: SendotpService,
    private route: ActivatedRoute,
    private router: Router) { }

  tcode_json = [{ tcode: "", value: "", desc: "Please T-Code/ Description for Search" },];

  goBackToPrevPage() {
    window.history.back();
  }

  // -----------*** -------------
  // Add Tcode form validation
  // -----------*** -------------
  editTCodeForm: any = new FormGroup({
    agg: new FormControl('', [Validators.required,]),
    selection: new FormControl('', [Validators.required]),
    upload_pdf_file: new FormControl(''),
    upload_dwg_file: new FormControl(''),
    upload_3d_file: new FormControl(''),
    upload_too_pic: new FormControl(''),
    item_desc: new FormControl('')
  })

  get agg() {
    return this.editTCodeForm.get('agg')
  }

  get selection() {
    return this.editTCodeForm.get('selection')
  }
  get upload_pdf_file() {
    return this.editTCodeForm.get('upload_pdf_file')
  }
  get upload_dwg_file() {
    return this.editTCodeForm.get('upload_dwg_file')
  }
  get upload_3d_file() {
    return this.editTCodeForm.get('upload_3d_file')
  }
  get upload_too_pic() {
    return this.editTCodeForm.get('upload_too_pic')
  }

  _the_master_id: any = ''
  _take_desi_pdf: Number = 0
  _take_desi_dwg: Number = 0
  _take_desi_3d: Number = 0
  _take_desi_photo: Number = 0

  _callForHistoryFn(entity: any) {
    const uploadUrl = `${this.HOST}/api/tools/file/history/${this._glogbal_dynamic_id}`;
    fetch(uploadUrl, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this._array_History = res.filter((e: any) => e.entity == entity)
        this._array_History.reverse();
      }).catch((err) => {
        console.log(err)
      })
  }

  ngAfterViewInit() {
    const dynamicValue = this.route.snapshot.paramMap.get('id');
    this._glogbal_dynamic_id = this.route.snapshot.paramMap.get('id');
    this._the_master_id = this.route.snapshot.paramMap.get('id');
    this._getPlant_menu();
    this.http.get(`${this.HOST}/api/tools/design/${dynamicValue}`).subscribe((response: any) => {
      console.log(response)
      // Update the form field with the API data
      this.editTCodeForm.value.plants = response[0].ekl_plant
      //this.editTCodeForm.value.agg = response[0].ekl_aggregate_id
      this.editTCodeForm.value.selection = response[0].item_code
      this.editTCodeForm.value.item_desc = response[0].item_description

      this.editTCodeForm.value.upload_pdf_file = response[0]?.file_pdf
      this.editTCodeForm.value.upload_dwg_file = response[0]?.file_dwg
      this.editTCodeForm.value.upload_3d_file = response[0]?.file_3d
      this.editTCodeForm.value.upload_too_pic = response[0]?.file_photo
      this.description = response[0].item_description

      this._take_desi_pdf = response[0]?.file_pdf
      this._take_desi_dwg = response[0]?.file_dwg
      this._take_desi_3d = response[0]?.file_3d
      this._take_desi_photo = response[0]?.file_photo
      this.route.params.subscribe(params => {
        const dynamicValue = params['id'];
      });

      let aggSelectedValue = response[0].ekl_division.split(",");
      aggSelectedValue = aggSelectedValue.map(Number);

      this.editTCodeForm.patchValue({
        agg: aggSelectedValue,
        selection: response[0].item_code,
        item_desc: response[0].item_description,
        file_pdf_id: response[0]?.file_pdf,
        file_dwg_id: response[0]?.file_dwg,
        file_3d_id: response[0]?.file_3d,
        file_photo_id: response[0]?.file_photo
      });
    });
  }

  _set_Entity = ''
  _identify_which_entity(entity: string) {
    this._callForHistoryFn(entity)
  }
  _array_History: any

  file_pdf_id = ''
  file_dwg_id = ''
  file_3d_id = ''
  file_photo_id = ''

  editTCodeFormFunc() {
    this.editTCodeForm.value.selection = this.editTCodeForm.controls.t_code
    this.editTCodeForm.value.agg = this.editTCodeForm.controls.agg.value
    this.editTCodeForm.value.item_desc = this.editTCodeForm.controls.item_description

    this.editTCodeForm.value.upload_pdf_file = this.file_pdf_id || this._take_desi_pdf
    this.editTCodeForm.value.upload_dwg_file = this._take_desi_dwg || this.file_dwg_id
    this.editTCodeForm.value.upload_3d_file = this._take_desi_3d || this.file_3d_id
    this.editTCodeForm.value.upload_too_pic = this._take_desi_photo || this.file_photo_id

    // ----------------------------------------------
    // tCode api api trigger only form is validated 
    // ----------------------------------------------
    // console.log(this.editTCodeForm)
    if (this.editTCodeForm.invalid) {
      Swal.fire({
        title: "Please select all the fields!",
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }

    if (!this.editTCodeForm.invalid) {
      const formData = {
        tools_master_id: this._the_master_id,
        item_code: this.t_code || this.editTCodeForm.controls.selection?.value,
        item_desc: this.description || this.editTCodeForm.controls.item_desc?.value,
        division: this.editTCodeForm.controls.agg.value?.toString(),

        file_pdf_id: this.file_pdf_id || this._take_desi_pdf,
        file_dwg_id: this.file_dwg_id || this._take_desi_dwg,
        file_3d_id: this.file_3d_id || this._take_desi_3d,
        file_photo_id: this.file_photo_id || this._take_desi_photo,
        uid: this.userData[0].user_id
      }
      // alert(JSON.stringify(formData))
      const uploadUrl = `${this.HOST}/api/tools/design/modify`;
      fetch(uploadUrl, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()).
        then(res => {
          if (res.error == false) {
            Swal.fire({
              title: res.msg,
              icon: 'success',
              confirmButtonText: 'Done'
            })
          }
          if (res.error == true) {
            Swal.fire({
              title: res.msg,
              icon: 'error',
              confirmButtonText: 'ok'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
    }
  }

  description = ''
  searchTcodeApiFn(event: any) {
    this.description = event.tcode
    this.getSearchTcode.getAllTcode(event.target.value).subscribe((res: any) => {
      this.tcode_json = res.data
      this.description = res.desc
    })
  }

  t_code = ''
  searchTcodesetValue(event: any) {
    this.t_code = event.value
    //console.log(this.t_code)
    this.description = event.desc
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

  progressBar = false
  uploadFile(file: any, index: number, folder: string) {
    this.progressBar = true
    const formData = new FormData();
    formData.append('uploadfile', file);
    formData.append('entity', `${folder}`);
    formData.append('tool_master_id', `${this._glogbal_dynamic_id}`);
    formData.append('uid', `${this.userData[0].user_id}`);
    // console.log(folder, 'folder')
    const uploadUrl = `${this.HOST}/upload`;
    fetch(uploadUrl, {
      method: "POST",
      body: formData,
    }).then(response => response.json()).
      then(res => {
        // console.log(res.data.file_id, 'file_id')
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
    this.router.navigate(['']);
  }

  // _multi_select_data: any = ''
  _getPlant_menu() {
    const uploadUrl = `${this.HOST}/api/agg/plant/`;
    fetch(uploadUrl, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).
      then(res => {
        this.plantAggGroups = res.data[0]
      }).catch((err) => {
        console.log(err)
      })
  }

  //  ----------------------------------
  //  Delete file code
  //  ----------------------------------

  _del_file(id: any) {
    console.log(id, 'eeeeeeeeeeee')
    const formData = {
      file_id: id,
    }
    Swal.fire({
      title: "Do you want to Delete the file ?",
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then((e) => {
      if (e.isConfirmed === true) {
        const inActiveUrl = `${this.HOST}/api/tools/file`;
        fetch(inActiveUrl, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }).then(response => response.json()).
          then(res => {
            if (res.error == false) {
              Swal.fire({
                title: res.msg,
                icon: 'success',
                confirmButtonText: 'Done',
              }).then((e) => {
                if (e.isConfirmed === true) {
                  window.location.reload();
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


}
