import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { TutionService } from "src/app/tution.service";

@Injectable({
  providedIn: 'root'
})
export class TutionAdminAuthGuardGuard implements CanActivate {
  constructor(
    private tutionService: TutionService,
    private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Promise<boolean> {
    if (!this.tutionService.isAdminLoggedIn) {
      this.router.navigate(['tution/admin']);
    }
    return this.tutionService.isAdminLoggedIn;
  }
}