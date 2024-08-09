import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { setTimeout } from 'timers';

@Component({
  selector: 'app-search-vehicle',
  templateUrl: './search-vehicle.component.html',
  styleUrls: ['./search-vehicle.component.scss', '../../quote/quote/quote.component.scss', '../../../assets/quote/css/style.css']
})
export class SearchVehicleComponent implements OnInit, AfterViewInit {

  @ContentChild('vehicleConfirmationModal', { static: false }) vehicleConfirmationModal: TemplateRef<any>;
  formStep: number = 1;
  searchForm: FormGroup;
  isOdlData: boolean = false;
  quoteFormData: any = null;
  detailsForm: FormGroup;
  prospectForm: FormGroup;
  vehicleList: any[] = [];
  details: any = null;
  dialogRef: any = null;
  showlogo: boolean = true;
  white_label = 1;
  source_user: string = "100173";
  isLoggedIn: boolean = false;
  user_code = '0';
  prospectSubmitted: any;
  prospectConfirmMsg: boolean = false;
  prospectConfirmErrMsg: boolean = false;
  prospectConfirmError: boolean = false;
  USERURL: string = "";
  BASEURL: string = "";
  successProspect: boolean = false;
  panelOpenState = false;
  isRollType8: boolean = false;
  POSP_URL: string = "";
  POSP_name: string = ""; POSPshortname: string = "";
  quoteForm = this._formBuilder.group({
    isRenewal: ['1', [Validators.required]],
    userCode: ['0'],
    car_fullname: [''],
    registration_date: [''],
    registration_date_text: [''],
    manufacture_date: [''],
    brand_name: [''],
    brand_code: [''],
    model_name: [''],
    fuel_name: [''],
    fuel_type_text: [''],
    variant_name: [''],
    car_id: [''],
    car_cc: [''],
    rto_id: [''],
    rtoText: [''],
    rto_details: [''],
    prev_ncb: [0],
    new_ncb: [0],
    idv: [0],
    zero_dep: [0],
    pa_owner: [0],
    vol_discount: [0],
    brandFormGroup: this._formBuilder.group({
      brandCtrl: ['', [Validators.required]]
    }),
    modelFormGroup: this._formBuilder.group({
      modelCtrl: [null, [Validators.required]]
    }),
    fuelFormGroup: this._formBuilder.group({
      fuelCtrl: [null, [Validators.required]]
    }),
    variantFormGroup: this._formBuilder.group({
      variantCtrl: [null, [Validators.required]]
    }),
    regisFormGroup: this._formBuilder.group({
      regisCtrl: [null, [Validators.required]],
      regisYrCtrl: ['', [Validators.required]]
    }),
    contactFormGroup: this._formBuilder.group({
      mobileNoCtrl: ['', [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/)]],
      emailCtrl: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
      expiryDate: ['', [Validators.required]],
      lastClaim: ['0', [Validators.required]]
    }),
    options: this._formBuilder.group({
      floatLabel: ['1', [Validators.required]],
    })
  });

  buttonStatus: {
    search: boolean,
    details: boolean
  } = {
      search: true,
      details: true,
    };

  quoteJson: any;
  requestJson: any = {};
  userJson: any;
  carJson: any;
  selectedCarJson: any;
  selectedRtoJson: any;
  form_variant: string = "0";
  form_premium_type = 1;
  rtoJson: any;
  CNG_LPG_Kit_type: boolean = false;
  carrierType: any = "";
  uniqueID: any;
  affiliate_customer_request_id: any = "";
  regMaxDate: any;
  regMinDate: any;
  expireMaxDate: any;
  deviceInfo = null;
  device_info: any;
  role_type: string = "";
  user_token: string = "";
  isEdit: boolean;
  IS_LIVE: number;
  isShowOffer: boolean;
  isPospImg: boolean;
  POSP_img: any;
  domain_url="";
  carInsurUrl:any;
  bikeInsurUrl:any;
  cvInsurUrl:any;
  healthInsurUrl:any;
  travelInsurUrl:any;
  termInsurUrl:any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private localStorage: LocalStorage,
    private router: Router,
    public dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    private apiService: AppService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.searchForm = this._formBuilder.group({
      registration_no: ['', [Validators.required]]
    });

    this.detailsForm = this._formBuilder.group({
      mobile_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12), Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]],
      email_id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      dontHavePreviousYearPolicy: [false, [Validators.required]],
      expiry_date: [null, [Validators.required]],
      lastClaimedYear: ['0', [Validators.required]],
    });

    this.prospectForm = this._formBuilder.group({
      prospectName: ['', [Validators.required]],
      prospectPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      //prospectEmail: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
      prospectEmail: ['', [Validators.required, Validators.pattern(/^[^\W_](?:[\w.-]*[^\W_])?@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
      prospectPassword: ['', [Validators.required]],
      prospectConfPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.setPospURL();
    this.clear();
    this.domain_url = this.apiService.getDomainURL();
    this.carInsurUrl = `${this.domain_url}car-insurance/`;
    this.bikeInsurUrl = `${this.domain_url}two-wheeler-insurance/`;
    this.cvInsurUrl = `${this.domain_url}commercial-vehicle-insurance/`;
    this.healthInsurUrl = `${this.domain_url}health-insurance/`;
    this.travelInsurUrl = `${this.domain_url}travel-insurance/`;
    this.termInsurUrl = `${this.domain_url}term-insurance/`;
    this.USERURL = this.apiService.getUserServiceURL();
    this.BASEURL = this.apiService.getBaseURL();
    var d = new Date();
    this.uniqueID = d.getTime();
    this.epicFunction();

    var curr_year = new Date().getFullYear();
    var last_year = new Date().getFullYear() - 20;
    this.regMinDate = last_year;
    this.regMaxDate = curr_year - 1;

    // this.openDialog();
    this.localStorage.getItem('userJson').subscribe((data: any) => {
      if (data != null) {
        this.userJson = data;
        this.source_user = data.source_user;
        this.role_type = data.role_type;
        this.user_token = data.token;
        this.isLoggedIn = true;
        if (data.white_label == '1') {
          this.white_label = 1;
        } else {
          this.white_label = 0;
        }
        let userCode = data.user_code;
        this.user_code = userCode;
        this.quoteForm.get('userCode').setValue(userCode);
      } else {
        this.white_label = 0;
        this.user_code = '100173';
        this.quoteForm.get('userCode').setValue(0);
      }
    });
  }
  clear() {
    this.localStorage.removeItem('proposalJson').subscribe(() => { })
    this.localStorage.removeItem('quoteJson').subscribe(() => { })
    this.localStorage.removeItem('premiumJson').subscribe(() => { })
    // this.localStorage.clear().subscribe(() => {
    //   console.log('All items cleared');
    // });
  }
  onRegnoInput(): void {
    this.searchForm.controls['registration_no'].setValue(this.searchForm.value.registration_no.toString().replace(/(\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase()));
  }
  onRegnoChange(): void {
    this.onRegnoInput();
    // this.preQuoteStore.dispatch(setNameValue({ name: this.quoteForm.value.contact_details.name }));
  }

  onSearchFormSubmit(vehicleConfirmationModal) {
    this.buttonStatus.search = false;
    this.buttonStatus.details = true;
    this.formStep = 1;

    this.requestJson = {
      userJson: this.userJson,
      policy_type: 'FW',
      registration_no: this.searchForm.value.registration_no
    };

    if (this.searchForm.valid) {
      // this.detailsForm.controls["lastClaimedYear"].setValue("1");
      this.apiService.getRelatedVehicle(this.requestJson).subscribe((data: any) => {
        if (data.vehicle_id) {
          this.isOdlData = true;
          this.formStep = 2;
          this.quoteFormData = {
            registration_no: data.details.registration_no,
            vehicle_id: data.vehicle_id,
            name: data.details.name,
            fuel_type: data.details.fuel_type,
            dontHavePreviousYearPolicy: data.details.have_previous_year_policy,
            registration_date: data.details.registration_date,
            registration_year: data.details.registration_year,
            insurance_upto: data.details.insurance_upto,
            rto: data.details.rto,
            mobile_no: data.details.mobile_no,
            email_id: data.details.email_id,
            lastClaimedYear: data.details.last_year_claim_status == true ? 1 : 0,
            previous_insurance_company: data.details.previous_insurance_company,
            previous_insurance_company_id: data.details.previous_insurance_company_id,
            previous_policy_number: data.details.previous_policy_number,
            expiry_date: data.details.policy_expiry_date,
            page_status: {
              quote: false,
              listing: false,
              proposal: false,
            }
          };
          this.detailsForm.controls["mobile_no"].setValue(data.details.mobile_no);
          this.detailsForm.controls["email_id"].setValue(data.details.email_id);
          this.detailsForm.controls["dontHavePreviousYearPolicy"].setValue(data.details.have_previous_year_policy);
          this.detailsForm.controls["lastClaimedYear"].setValue(data.details.last_year_claim_status == true ? "1" : "0");
          // this.detailsForm.controls["expiry_date"].setValue(new Date(data.details.policy_expiry_date.month + "-" + data.details.policy_expiry_date.day + "-" + data.details.policy_expiry_date.year));

          // this.detailsForm.controls["expiry_date"].setValue(new Date(12 + "-" + 25 + "-" + 2022));
          if (data.details.policy_expiry_date) {
            this.detailsForm.controls["expiry_date"].setValue(new Date(data.details.policy_expiry_date.month + "-" + data.details.policy_expiry_date.day + "-" + data.details.policy_expiry_date.year));
          } else {
            this.detailsForm.controls["expiry_date"].setValue(null);
          }

          this.openDialog(vehicleConfirmationModal);
        } else if (data.vehicle_list && data.vehicle_list.length > 0) {
          // this.detailsForm.controls["expiry_date"].setValue(new Date(data.details.policy_expiry_date.month + "-" + data.details.policy_expiry_date.day + "-" + data.details.policy_expiry_date.year));
          if (data.details.policy_expiry_date) {
            this.detailsForm.controls["expiry_date"].setValue(new Date(data.details.policy_expiry_date.month + "-" + data.details.policy_expiry_date.day + "-" + data.details.policy_expiry_date.year));
          } else {
            this.detailsForm.controls["expiry_date"].setValue(null);
          }
          this.vehicleList = data.vehicle_list;
          this.details = data.details;
          this.onSelectVehicle(this.vehicleList[0]);
          this.openDialog(vehicleConfirmationModal);
        } else {
          this.router.navigate(['search'], {});
        }
      });
    } else {
      this.buttonStatus.search = true;
    }
  }

  onSelectVehicle(vehicle) {
    this.buttonStatus.details = false;
    this.formStep = 2;
    this.quoteFormData = {
      registration_no: this.details.registration_no,
      vehicle_id: vehicle.id,
      name: this.details.name,
      fuel_type: this.details.fuel_type,
      registration_date: this.details.registration_date,
      registration_year: this.details.registration_year,
      insurance_upto: this.details.insurance_upto,
      previous_insurance_company: this.details.previous_insurance_company,
      previous_insurance_company_id: this.details.previous_insurance_company_id,
      previous_policy_number: this.details.previous_policy_number,
      expiry_date: this.details.policy_expiry_date,
      page_status: {
        quote: false,
        listing: false,
        proposal: false,
      },

      rto: this.details.rto,
      mobile_no: "",
      email_id: "",
    };
    this.buttonStatus.details = true;
    return 0;
  }

  onDetailsFormSubmit(vehicleConfirmationModal) {
    this.buttonStatus.details = false;
    if (this.detailsForm.valid) {
      this.quoteFormData.mobile_no = this.detailsForm.value.mobile_no;
      this.quoteFormData.email_id = this.detailsForm.value.email_id;
      // this.quoteFormData.expiry_date = this.detailsForm.value.expiry_date.year + "-" + this.detailsForm.value.expiry_date.month + "-" + this.detailsForm.value.expiry_date.day;
      this.quoteFormData.expiry_date = this.detailsForm.value.expiry_date;
      this.quoteFormData.dontHavePreviousYearPolicy = this.detailsForm.value.dontHavePreviousYearPolicy;
      this.quoteFormData.lastClaimedYear = this.detailsForm.value.lastClaimedYear;

      if (this.isOdlData) {
        this.localStorage.setItem('quote_form_data', this.quoteFormData).subscribe(() => {
          // this.router.navigate(['search'], {});
          this.redirectToListingPage();
        });
      } else {
        let payload = {
          registration_no: this.searchForm.value.registration_no,
          vehicle_id: this.quoteFormData.vehicle_id,
          name: this.quoteFormData.name,
          mobile_no: this.quoteFormData.mobile_no,
          email_id: this.quoteFormData.email_id,
          registration_date: this.quoteFormData.registration_date.year + "-" + this.quoteFormData.registration_date.month + "-" + this.quoteFormData.registration_date.day,
          have_previous_year_policy: this.quoteFormData.dontHavePreviousYearPolicy,
          policy_expiry_date: this.quoteFormData.expiry_date.getFullYear() + "-" + (this.quoteFormData.expiry_date.getMonth() + 1) + "-" + this.quoteFormData.expiry_date.getDate(),
          last_year_claim_status: this.quoteFormData.lastClaimedYear,
          rto: this.quoteFormData.rto,
          fuel_type: this.quoteFormData.fuel_type,
          vehicle_type: "Car",
          previous_insurance_company: this.quoteFormData.previous_insurance_company,
          previous_insurance_company_id: this.quoteFormData.previous_insurance_company_id,
          previous_policy_number: this.quoteFormData.previous_policy_number
        }
        this.apiService.storeVehicleHistory(payload).subscribe((data) => {
          this.localStorage.setItem('quote_form_data', this.quoteFormData).subscribe(() => {
            // this.router.navigate(['search'], {});
            this.redirectToListingPage();
          });
        });
      }
      this.closeDialog();
    } else {
      this.buttonStatus.details = true;
      // this.openDialog(vehicleConfirmationModal);
    }
  }

  prospectSubmit() {
    this.prospectSubmitted = true;
    this.prospectConfirmMsg = false;
    this.prospectConfirmErrMsg = false;

    if (this.prospectForm.invalid) {
      return;
    } else {
      if (this.prospectForm.value.prospectPassword != this.prospectForm.value.prospectConfPassword) {
        this.prospectConfirmError = true;
        return;
      } else {
        this.prospectConfirmError = false;
        let prospectJson = {
          "prospect_name": this.prospectForm.value.prospectName,
          "prospect_phone": this.prospectForm.value.prospectPhone,
          "prospect_email": this.prospectForm.value.prospectEmail,
          "prospect_password": this.prospectForm.value.prospectPassword,
          "prospect_conf_password": this.prospectForm.value.prospectConfPassword,
          "source_value": "TWLANDING",
          "serviceUrl": ""
        };

        prospectJson.serviceUrl = this.USERURL + "pos-registration.php";
        this.apiService.registration(prospectJson).subscribe((data: any) => {
          let submit_res = (data);

          if (submit_res.flag_proceed == true) {
            this.openSnackBar('Thank you for your interest, we will get back to you soon.', '');
            this.prospectSubmitted = false;
            this.prospectForm.reset();
            this.successProspect = true;
          } else {
            this.openSnackBar(submit_res.errMsgs, '');
            this.prospectSubmitted = false;
            //this.prospectForm.reset();
            this.successProspect = true;
          }
        });
      }
    }
  }

  // homepage() {
  //   this.localStorage.getItem('userJson').subscribe((data: any) => {
  //     if (data != null) {
  //       if (data.role_type.toString() == "8") {
  //         window.location.href = this.apiService.getPospURL();
  //       } else {
  //         window.location.href =  this.apiService.getPospURL();
  //       }
  //     }
  //   });
  // }
  setPospURL() {
    this.localStorage.getItem('userJson').subscribe((data: any) => {
      if (data != null) {
        this.isLoggedIn = true;
        if (data.role_type == '8') {
          this.isRollType8 = true;
          this.POSP_URL = this.apiService.getPospURL();
          if (data.profile_pic_url) {
            if (data.profile_pic_url != "") {
              this.isPospImg = true;
              this.POSP_img = data.profile_pic_url;
            } else {
              this.isPospImg = false;
              this.POSP_name = data.name;
              this.POSPshortname = this.getshortname(this.POSP_name);
            }
          } else {
            this.isPospImg = false;
            this.POSP_name = data.name;
            this.POSPshortname = this.getshortname(this.POSP_name);

          }
        }
      }
    });

  }


  getshortname(fullname: string) {
    return fullname.split(' ').map(n => n[0]).join('');
  }

  checkLength() {
    if (this.detailsForm.value.mobile_no && this.detailsForm.value.mobile_no.toString().length > 10) {
      this.detailsForm.controls['mobile_no'].setValue(parseInt(this.detailsForm.value.mobile_no.toString().substring(0, 10)));
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
    });
  }

  /**
   * modal function
   */

  onNoClick() {
    this.dialogRef.close();
  }
  openDialog(modalTemplateRef): void {
    this.dialogRef = this.dialog.open(modalTemplateRef, {
      width: '600px',
      panelClass: 'new_popup_buy_now',
    });
    this.dialogRef.disableClose = true;
    this.dialogRef.afterClosed().subscribe(result => {
      this.buttonStatus.search = true;
    });
  }
  closeDialog(): void {
    this.buttonStatus.search = true;
    this.dialogRef.close(0);
  }

  /**
   * end modal function
   */

  logout() {
    this.localStorage.removeItem('userJson').subscribe(() => {
      this.quoteForm.get('userCode').setValue(0);
      this.source_user = "100173";
      this.isLoggedIn = false;
      this.white_label = 0;
    });
  }

  registrationPage() {
    window.location.href = "https://www.gibl.in/UI/Pages/Registration.aspx";
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    let source_device = '';
    if (isMobile) {
      source_device = 'MOBILE'
    }
    else if (isTablet) {
      source_device = 'TABLET'
    }
    else if (isDesktopDevice) {
      source_device = 'DESKTOP'
    }
    this.device_info = {
      visitor_source: "GIBL.IN",
      visitor_device: source_device,
      visitor_browser: this.deviceInfo.browser.toUpperCase(),
      visitor_agent: this.deviceInfo.userAgent
    }
  }

  redirectToListingPage() {
    this.apiService.getcarJson().subscribe((data: any) => {
      if (data) {
        this.carJson = (typeof data == 'string' ? JSON.parse(data) : data);
        this.carJson.forEach(el => {
          if (el.id == this.quoteFormData.vehicle_id) {
            this.selectedCarJson = el;
          }
        });

        this.apiService.getrtoJson().subscribe((data1: any) => {
          if (data1) {
            this.rtoJson = (typeof data1 == 'string' ? JSON.parse(data1) : data1);
            this.rtoJson.forEach(el1 => {
              if (el1.id == this.quoteFormData.rto) {
                this.selectedRtoJson = el1;
              }
            });

            let now = new Date();
            let ped = new Date(this.quoteFormData.insurance_upto);
            let pre_policy_expiry_date = { year: ped.getFullYear(), month: ped.getMonth() + 1, day: ped.getDate() };

            let regDt = this.quoteFormData.registration_date;
            let regDtStr = regDt.year + "-" + regDt.month + "-" + regDt.day;
            let regDate = new Date(regDtStr);
            let month = regDate.toLocaleString('default', { month: 'short' });
            let regDtTxt = regDt.day + " " + month + " " + regDt.year;
            // let manufactureDate = regDt.year+"-"+regDt.month+"-1";
            let manufactureDate = { year: regDt.year, month: regDt.month, day: 1 };

            let now1 = new Date();
            now1.setDate(now1.getDate() + 60);
            this.expireMaxDate = new Date(now1.getFullYear(), now1.getMonth() + 1, now1.getDate());

            let last_claimed_year = "";
            if (this.quoteFormData.lastClaimedYear == 1) {
              let last_claimed_year = now.getFullYear() - 1;
            } else {
              last_claimed_year = this.quoteFormData.registration_year;
            }

            let contactFormGroup = { "mobileNoCtrl": this.quoteFormData.mobile_no, "emailCtrl": this.quoteFormData.email_id, "expiryDate": this.quoteFormData.expiry_date, "lastClaim": this.quoteFormData.lastClaimedYear }

            let fuel_type_text = "";
            let lpg_cngkit = 0;
            if (this.selectedCarJson.fuel_type_text == 'Ext Cng') {
              fuel_type_text = 'Petrol';
              this.CNG_LPG_Kit_type = true;
              lpg_cngkit = 20000;
            } else {
              fuel_type_text = this.selectedCarJson.fuel_type_text;
              this.CNG_LPG_Kit_type = false;
              lpg_cngkit = 0;
            }

            var prev_ncb = 0;
            var new_ncb = 0;
            let yearSpan = 0;
            let lastClaimedYear = parseInt(this.quoteFormData.lastClaimedYear);
            if (this.form_premium_type == 1) {
              let manufactureYear = parseInt(regDt.year);
              let currYear = new Date().getFullYear();
              if (lastClaimedYear == 0) {
                yearSpan = currYear - manufactureYear;
              } else {
                yearSpan = currYear - manufactureYear + 1;
              }
              switch (yearSpan) {
                case 0: new_ncb = 0; prev_ncb = 0; break;
                case 1: new_ncb = 20; prev_ncb = 0; break;
                case 2: new_ncb = 25; prev_ncb = 20; break;
                case 3: new_ncb = 35; prev_ncb = 25; break;
                case 4: new_ncb = 45; prev_ncb = 35; break;
                case 5: new_ncb = 50; prev_ncb = 45; break;
              }
              if (yearSpan > 5) {
                new_ncb = 50;
                prev_ncb = 50;
              }
              if (lastClaimedYear == 1) {
                prev_ncb = 0;
                new_ncb = 0;
              }
            } else {
              this.regMaxDate = this.regMaxDate + 1;
              prev_ncb = 0;
              new_ncb = 0;
            }

            this.quoteJson = {
              "policy_type": 'MOTOR',
              "quoteID": '',
              "KOTAK_ORIGINAL_IDV": 0,
              "user_code": this.user_code,
              "brand_code": this.selectedCarJson.brand_code,
              "model_code": this.selectedCarJson.model_code,
              "fuel_type": this.selectedCarJson.fuel_type_text,
              "variant_code": this.form_variant,
              "rto_id": this.selectedRtoJson.id,
              "rto_code": this.selectedRtoJson.rto_code,
              "form_premium_type": this.form_premium_type,
              "is_renewal": this.form_premium_type,
              "cust_email": this.quoteFormData.email_id,
              "cust_phone": this.quoteFormData.mobile_no,
              "pre_policy_type": "COMPREHENSIVE",
              "pre_policy_expiry_date": pre_policy_expiry_date,
              "registration_date": this.quoteFormData.registration_date,
              "registration_date_text": regDtTxt,
              "manufacture_date": manufactureDate,
              "last_claimed_year": last_claimed_year,
              "contactFormDetails": contactFormGroup,
              "lastClaim": this.quoteFormData.lastClaimedYear,
              "car_fullname": this.selectedCarJson.full_name,
              "brand_name": this.selectedCarJson.brand_name,
              "model_name": this.selectedCarJson.model_name,
              "fuel_type_text": fuel_type_text,
              "fuel_name": this.selectedCarJson.fuel_type_text,
              "variant_name": this.selectedCarJson.variant_name,
              "car_cc": this.selectedCarJson.cubic_capacity,
              "rtoText": this.selectedRtoJson.rto_code + ' ' + this.selectedRtoJson.city_name + ', ' + this.selectedRtoJson.sname,
              "car_id": this.selectedCarJson.id,
              "rto_details": this.selectedRtoJson,
              "prev_insurer": 0,
              "modifyIDV": 0,
              "idv": 0,
              "paid_driver_type": false,
              "paid_driver": 0,
              "ll_paid_driver_type": false,
              "ll_paid_driver": 0,
              "pa_owner_type": false,
              "pa_owner": 0,
              "is_unnamed_passenger": 0,
              "elec_acc_type": false,
              "elec_acc": 0,
              "non_elec_acc_type": false,
              "non_elec_acc": 0,
              //"CNG_LPG_Kit_type": false,
              //"lpg_cngkit": 0,
              "CNG_LPG_Kit_type": this.CNG_LPG_Kit_type,
              "lpg_cngkit": lpg_cngkit,
              "vol_discount": 0,
              "prev_ncb": prev_ncb,
              "new_ncb": new_ncb,
              "carrier_type": this.carrierType,
              "dont_have_prev_policy": this.quoteFormData.dontHavePreviousYearPolicy,
              'occupationType': 0,
              'dob': '',
              'associationName': '',
              'membershipNo': '',
              'antiTheftDevice': 0,
              'carAccessories': '',
              'nonElectricalAccessories': '',
              'imt': 0,
              'coverType': '',
              "zero_dep": 0,
              "kotak_nil_dep": 0,
              "engine_protector": 0,
              "consumable_cover": 0,
              "ncb_protector": 0,
              "roadside_assistance": 0,
              "invoice_return": 0,
              "tyre_cover": 0,
              "travel_cover": 0,
              "personal_cover": 0,
              "loss_key_cover": 0,
              "rim_damage": 0,
              "medical_cover": 0,
              "daily_allowance": 0,
              "loss_accessories_cover": false,
              'contactForm': contactFormGroup,
              "uniqueID": this.uniqueID,
              "affiliate_customer_request_id": this.affiliate_customer_request_id,
              "unnamed_passenger": 100000,
              "is_voluntary_deduct": false,
              "voluntary_deduct_am": 0,
              "is_biFuelKit": false,
              "biFuelKit_Si": 0,
              "is_tppd_deduct": false,
              "occupationDiscount": false,
              "occupationDiscountValue": null,
              "motorAssociationDiscount": false,
              "motorAssociationDiscountValue": [{ association_Name: "" }, { membership_No: "" }, { expiry_Date: "" }],
              "AntiTheftDeviceDiscount": false,
              "showCustomIDV": false,
              "regMinDate": new Date(this.regMinDate, now.getMonth(), now.getDate()),
              "regMaxDate": new Date(this.regMaxDate, now.getMonth(), now.getDate()),
              "minExpDate": new Date(regDt.year + 1, regDt.month - 1, regDt.day),
              "maxExpDate": this.expireMaxDate,
              "isThirdParty": false,
              "premium_type": "COM",
              "modify_coverItem": false,
              "pa_cover_checked": false,
              "recal": false,
              "HandicappedDiscount": false,
              "deviceInfo": this.device_info,
              "modifyCarInfo": false,
              "kotak_addon": false,
              "source_user": this.source_user,
              "role_type": this.role_type,
              "user_token": this.user_token,
              "deductWallet": 0
            };

            this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
              this.router.navigate(['quote-compare'], {});
            });
          }
        });
      }
    });
  }

  onClickManual() {
    this.router.navigate([''], {});
    this.closeDialog();
  }

  supportLink() {
    window.location.href = this.apiService.getDomainURL() + "contact-us/";
  }
  editDetail() {

    this.localStorage.getItem('backToQuote').subscribe((data1: any) => {
      //let backQuote = data1.back;
      if (data1 != null && data1.back) {
        this.localStorage.getItem('quoteJson').subscribe((data) => {
          this.quoteJson = data;
          if (this.quoteJson != null) {
            this.isEdit = true;
            this.quoteForm.get('isRenewal').setValue(this.quoteJson.is_renewal);
            if (this.IS_LIVE == 2) {
              // this.isNewCar(1);
              this.quoteJson.form_premium_type = 1;
              this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
            }
            else {
              // this.isNewCar(this.quoteJson.is_renewal);
            }
            // this.brandChanged(this.quoteJson.car_id);
          }
        });
        let backToQuote = {
          back: false
        }
        this.localStorage.setItem('backToQuote', backToQuote).subscribe(() => { });
      }
      else {
        //this.form_premium_type = 1;
        this.localStorage.removeItem('quoteJson').subscribe(() => { });
        let backToQuote = {
          back: false
        }
        this.localStorage.setItem('backToQuote', backToQuote).subscribe(() => { });
      }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => { this.setPospURL() }, 500)

    this.editDetail();
    if (isPlatformBrowser(this.platformId)) {

      this.route.queryParams.subscribe(params => {
        console.log('queryParams',params);
       
        /*************************************Auto Login********************************/
        let loginJson;
        if (params.ref != null) {
          if (params.ref == "GIBLDNCD") {
            loginJson = {
              "uname": params.uname,
              "source": params.source,
              "acode": params.acode,
              "token": params.akey,
              "serviceUrl": ""
            };
            loginJson.serviceUrl = this.USERURL + "login.php?TYPE=2";
          }
          if (params.ref == "GIBLDNPOS") {
            loginJson = {
              "uname": params.uname,
              "acode": params.acode,
              "token": params.akey,
              "serviceUrl": ""
            };
            loginJson.serviceUrl = this.USERURL + "login.php?TYPE=3";
          }
          if (params.ref == "GIBLDNQRCODE") {
            loginJson = {
              "qrcode": params.qrcode,
              "serviceUrl": ""
            };
            loginJson.serviceUrl = this.USERURL + "login.php?TYPE=5";
          }
          if (params.ref == "GIBLDNTIEUP") {
            loginJson = {
              "tcode": params.tcode,
              "serviceUrl": ""
            };
            loginJson.serviceUrl = this.USERURL + "login.php?TYPE=6";
          }
          if (params.ref == "GIBLDNVISIT") {
            this.showlogo = true;
            this.white_label = 0;
            this.user_code = '100173';
          }
          if (loginJson) {
            this.apiService.signIn(loginJson).subscribe(data => {
              console.log('login',loginJson)
              let res: any = data;
              this.showlogo = true;
              let rd = (res);
              if (rd && rd.token) {
                if (rd.status == '1') {
                  this.isLoggedIn = true;
                  if (rd.white_label == '1') {
                    this.white_label = 1;
                  }
                  else {
                    this.white_label = 0;
                  }
                }
                else {
                  this.isLoggedIn = false;
                  if (rd.white_label == '1') {
                    this.white_label = 1;
                  }
                  else {
                    this.white_label = 0;
                  }
                }
                let userCode = rd.user_code;
                this.user_code = userCode;
                this.quoteForm.get('userCode').setValue(userCode);
                console.log('userCode 111',userCode)
                this.localStorage.setItem('userJson', rd).subscribe(() => {
                  this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
                });
              } else {
                this.white_label = 0;
                this.user_code = '100173';
                this.localStorage.setItem('userJson', "").subscribe(() => {
                  this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
                });
              }
            });
          }
        } else {
          console.log('queryParams12',params)
          this.showlogo = true;
          if (params.source != null) {
            console.log('queryParams12333333',params)
            loginJson = {
              "source": params.source,
              "serviceUrl": ""
            };
            loginJson.serviceUrl = this.USERURL + "login.php?TYPE=7";
            console.log('queryParams12loginJson333333',loginJson)
            this.apiService.signIn(loginJson).subscribe(data => {
              console.log('data',data)
              let res: any = data;
              let rd = (res);
              if (rd.token) {
                if (rd.status == '1') {
                  this.isLoggedIn = true;
                  if (rd.white_label == '1') {
                    this.white_label = 1;
                  }
                }
                else {
                  this.isLoggedIn = false;
                }

                let userCode = rd.user_code;
                this.user_code = userCode;
                this.localStorage.setItem('userJson', rd).subscribe(() => {
                  this.quoteForm.get('userCode').setValue(userCode);
                  this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
                });
              }
              else {
                this.isLoggedIn = false;
                this.user_code = '100173';
                this.localStorage.setItem('userJson', null).subscribe(() => {
                  this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
                });
              }
            });
          }
          else {
            this.localStorage.getItem('userJson').subscribe((data: any) => {
              if (data != null) {
                this.source_user = data.source_user;
                this.role_type = data.role_type;
                this.user_token = data.token;
                this.isLoggedIn = true;
                if (data.white_label == '1') {
                  this.white_label = 1;
                }
                else {
                  this.white_label = 0;
                }
                let userCode = data.user_code;
                this.user_code = userCode;
                this.quoteForm.get('userCode').setValue(userCode);
              }
              else {
                this.white_label = 0;
                this.user_code = '100173';
                this.quoteForm.get('userCode').setValue(0);

              }
            });
          }
        }
      });
    }
    this.cdRef.detectChanges();
  }
}


