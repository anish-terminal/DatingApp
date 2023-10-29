import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router : Router , private toastr : ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) => {
        if (error) {

          /**
           * @error 
           * {
           *  status: 400
           *  error{
           *    errors:[
           *      
           *    ]    
           *  }
           * }
           */
          switch(error.status){
            case 400:
              if (error.error.errors) {
                const modelstateError = [];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modelstateError.push(error.error.errors[key])
                  }
                }
                throw modelstateError.flat();  // flat is used to convert more than one array into one array
              }
              else{
                this.toastr.error(error.error , error.status.toString())
              }
              break;

              case 401:
                this.toastr.error('Unauthorized', error.status.toString());
                break;
              
              case 404:
                this.router.navigateByUrl('/not-found');
                break;
              
              case 500:
                const navigationExtras : NavigationExtras = {state : {error : error.error}}; // getting error.error and store it in router state
                this.router.navigateByUrl('/server-error', navigationExtras);
                break;

              default :
                this.toastr.error('Something Unexpected Went Wrong');
                console.log(error);
                break;
          }
        }
        throw error;
      })
    );
  }
}
