import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { timer } from 'rxjs';
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
 import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ReservaService } from '../../core/services/reserva.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;
    notificacionesCount: number = 0;
    currentUser: any;

    private autoLogoutSubscription: Subscription = new Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public spinnerService: SpinnerService,
        private authService: AuthenticationService,
        private authGuard: AuthGuard,
    private reservaService: ReservaService) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        const user = this.authService.getCurrentUser();

        this.isAdmin = user.isAdmin;
        this.userName = user.fullName;

        // Auto log-out subscription
        const timer$ = timer(2000, 5000);
        this.autoLogoutSubscription = timer$.subscribe(() => {
            this.authGuard.canActivate();
        });

        this.cargarNotificaciones();
    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    onLogout() {
        this.authService.logout(); 
        // Esta función ya se encarga de borrar el localStorage 
        // y redirigir al login.
    }

    cargarNotificaciones() {
        this.reservaService.getConteoHoy().subscribe(
            (data) => {
                this.notificacionesCount = data.total;
                console.log('Citas para hoy:', this.notificacionesCount);
            },
            (error) => console.error('Error cargando notificaciones', error)
        );
    }

    get esAdmin() { return this.currentUser?.usuario?.rol === 'ADMIN'; }
    get esOperador() { return this.currentUser?.usuario?.rol === 'OPERADOR'; }
    get esCalificador() { return this.currentUser?.usuario?.rol === 'CALIFICADOR'; }
}
