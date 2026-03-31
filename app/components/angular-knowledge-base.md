# Angular Knowledge Base — React Developer Perspective

> Bạn đã biết React. File này tập trung vào **những gì Angular làm khác React** và các concept cần nắm để apply job Angular.

---

## 0. Tổng quan: Angular vs React

| | React | Angular |
|---|---|---|
| Type | Library (UI only) | Full Framework |
| Language | JS/TS | TypeScript (bắt buộc) |
| Architecture | Component-based | Component + Module + Service |
| State | useState, Zustand, Redux | Services, NgRx, Signals |
| Routing | React Router | @angular/router (built-in) |
| Forms | React Hook Form, Formik | Template-driven / Reactive Forms (built-in) |
| HTTP | fetch, axios, React Query | HttpClient (built-in, RxJS-based) |
| DI | Manual / Context | Dependency Injection (built-in) |
| Reactivity | Re-render on state change | Change Detection / RxJS Observables |
| CLI | Vite, create-react-app | Angular CLI (ng) |

**Key mindset shift:** React là library — bạn chọn tools. Angular là framework — mọi thứ đã được quyết định sẵn.

---

## 1. Angular CLI

```bash
# Cài đặt
npm install -g @angular/cli

# Tạo project
ng new my-app
ng new my-app --style=scss --routing=true

# Generate code
ng generate component user-list         # tạo component
ng generate service user               # tạo service
ng generate module admin --routing     # tạo module với routing
ng generate pipe currency-format       # tạo pipe
ng generate directive highlight        # tạo directive
ng generate guard auth                 # tạo route guard
ng generate interface user            # tạo interface

# Shortcuts
ng g c components/header              # g = generate, c = component
ng g s services/auth                  # s = service

# Build & Dev
ng serve                              # dev server (localhost:4200)
ng serve --open                       # tự mở browser
ng build                              # production build
ng build --configuration=production
ng test                               # chạy unit tests (Karma)
ng e2e                                # e2e tests

# Lint & Format
ng lint
```

---

## 2. Module System (NgModule)

> React không có module system. Angular tổ chức code qua `NgModule`.

### AppModule — Root Module

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [      // Components, Directives, Pipes thuộc module này
    AppComponent,
    UserListComponent,
  ],
  imports: [           // Modules khác cần dùng
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [         // Services (DI)
    UserService,
  ],
  bootstrap: [AppComponent],  // Root component
})
export class AppModule {}
```

### Feature Module

```typescript
// admin/admin.module.ts
@NgModule({
  declarations: [AdminComponent, AdminDashboardComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
```

### Standalone Components (Angular 14+)

> Angular 14+ cho phép component không cần module — giống React hơn.

```typescript
@Component({
  selector: 'app-user',
  standalone: true,            // Không cần khai báo trong NgModule
  imports: [CommonModule, RouterLink],  // Import trực tiếp vào component
  template: `<div>{{ user.name }}</div>`,
})
export class UserComponent {}
```

---

## 3. Components

### Anatomy của một Angular Component

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',           // HTML tag: <app-user-card />
  templateUrl: './user-card.component.html',  // Template riêng
  // template: `<div>inline template</div>`,   // Hoặc inline
  styleUrls: ['./user-card.component.scss'],
  // styles: [`.card { padding: 16px; }`],     // Hoặc inline styles
})
export class UserCardComponent implements OnInit {
  // @Input() = props trong React
  @Input() user!: User;
  @Input() showActions = true;

  // @Output() = callback props / event emitter trong React
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<User>();

  // Local state = class properties (không cần useState)
  isExpanded = false;
  loading = false;

  constructor(private userService: UserService) {}  // Dependency Injection

  ngOnInit(): void {
    // Tương đương useEffect(() => {}, []) trong React
    // Chạy sau khi component init, đã có @Input values
  }

  // Event handler = method thông thường
  onDeleteClick(): void {
    this.delete.emit(this.user.id);
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
```

### Lifecycle Hooks — So sánh với React

| Angular | React | Mô tả |
|---|---|---|
| `ngOnInit()` | `useEffect(() => {}, [])` | Chạy một lần sau init |
| `ngOnChanges(changes)` | `useEffect(() => {}, [prop])` | Khi @Input thay đổi |
| `ngOnDestroy()` | `useEffect(() => { return () => {} })` | Cleanup |
| `ngAfterViewInit()` | `useEffect` + `ref` | Sau khi DOM render xong |
| `ngDoCheck()` | (không có tương đương trực tiếp) | Manual change detection |

```typescript
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class UserComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();  // Pattern cleanup subscription

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      const { currentValue, previousValue } = changes['user'];
      console.log('User changed:', previousValue, '→', currentValue);
    }
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))  // Auto unsubscribe khi destroy
      .subscribe(users => this.users = users);
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // Trigger cleanup
    this.destroy$.complete();
  }
}
```

### Template Syntax

```html
<!-- Interpolation — tương đương {variable} trong JSX -->
<h1>{{ user.name }}</h1>
<p>{{ price | currency:'USD' }}</p>

<!-- Property binding — tương đương prop={value} -->
<img [src]="user.avatar" [alt]="user.name">
<button [disabled]="isLoading">Submit</button>

<!-- Event binding — tương đương onClick={handler} -->
<button (click)="onDelete()">Delete</button>
<input (input)="onSearch($event)">
<form (submit)="onSubmit($event)">

<!-- Two-way binding — tương đương value + onChange -->
<input [(ngModel)]="searchQuery">

<!-- *ngIf — tương đương {condition && <Component />} -->
<div *ngIf="isLoggedIn">Welcome!</div>
<div *ngIf="user; else loading">{{ user.name }}</div>
<ng-template #loading><span>Loading...</span></ng-template>

<!-- *ngFor — tương đương {list.map(...)} -->
<li *ngFor="let item of items; let i = index; trackBy: trackById">
  {{ i + 1 }}. {{ item.name }}
</li>

<!-- [ngClass] / [ngStyle] — tương đương className conditional -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
<div [ngClass]="['btn', type === 'primary' ? 'btn-primary' : 'btn-secondary']">
<div [ngStyle]="{ color: textColor, fontSize: fontSize + 'px' }">

<!-- ng-container — tương đương Fragment -->
<ng-container *ngIf="isAdmin">
  <admin-panel />
  <admin-toolbar />
</ng-container>

<!-- @if, @for — Angular 17+ control flow (mới, syntax gọn hơn) -->
@if (isLoggedIn) {
  <div>Welcome {{ user.name }}</div>
} @else {
  <login-form />
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <p>No items found</p>
}
```

---

## 4. Services & Dependency Injection

> Đây là concept lớn nhất khác React. Angular có DI system built-in.

### Tạo Service

```typescript
// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',  // Singleton toàn app (giống Context + Provider ở root)
  // providedIn: 'any'  // Instance mới mỗi module
})
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  // BehaviorSubject = useState + Context trong React
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();  // $ convention = Observable

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(u => u.active)),
      catchError(error => {
        console.error('Failed to fetch users:', error);
        throw error;
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Inject Service vào Component

```typescript
@Component({ ... })
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Constructor injection = cách Angular inject dependency
  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  // Angular 14+: inject() function (không cần constructor)
  // private userService = inject(UserService);

  ngOnInit(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
}
```

---

## 5. RxJS — Reactive Programming

> RxJS là core của Angular. Bạn cần nắm basic để dùng Angular.

### Observable vs Promise

```typescript
// Promise (một lần, eager)
fetch('/api/users').then(res => res.json()).then(users => console.log(users));

// Observable (có thể nhiều lần, lazy — không chạy cho đến khi subscribe)
this.http.get<User[]>('/api/users').subscribe(users => console.log(users));
```

### Operators thường dùng

```typescript
import { of, from, interval, Subject, BehaviorSubject } from 'rxjs';
import {
  map, filter, switchMap, mergeMap, concatMap,
  debounceTime, distinctUntilChanged,
  catchError, retry, timeout,
  tap, takeUntil, take, skip,
  combineLatest, forkJoin, merge
} from 'rxjs/operators';

// map — tương đương .map() của array
this.http.get<ApiResponse>('/users').pipe(
  map(response => response.data)
);

// filter — tương đương .filter()
users$.pipe(filter(user => user.active));

// switchMap — hủy request cũ khi có request mới (QUAN TRỌNG với search)
// Tương đương pattern cancel + refetch trong React Query
searchQuery$.pipe(
  debounceTime(300),              // Đợi 300ms sau khi user gõ xong
  distinctUntilChanged(),          // Bỏ qua nếu giá trị không đổi
  switchMap(query =>               // Hủy Observable trước, tạo Observable mới
    this.userService.search(query)
  )
);

// forkJoin — tương đương Promise.all()
forkJoin({
  users: this.userService.getUsers(),
  roles: this.roleService.getRoles(),
}).subscribe(({ users, roles }) => {
  // Cả hai đã xong
});

// combineLatest — emit khi BẤT KỲ source nào thay đổi
combineLatest([users$, filters$]).pipe(
  map(([users, filters]) => applyFilters(users, filters))
);

// catchError — tương đương try/catch
this.http.get('/api').pipe(
  catchError(error => {
    console.error(error);
    return of([]);  // Trả về default value
  })
);

// takeUntil — tự động unsubscribe (PHẢI dùng để tránh memory leak)
this.service.getData().pipe(
  takeUntil(this.destroy$)
).subscribe();
```

### Subject — Shared State

```typescript
// Subject = EventEmitter / pub-sub
const subject = new Subject<string>();
subject.next('hello');        // emit value
subject.subscribe(v => ...);  // subscribe

// BehaviorSubject = có initial value, emit current value khi subscribe
// Tương đương createContext + useState trong React
private cartItems = new BehaviorSubject<CartItem[]>([]);
cartItems$ = this.cartItems.asObservable();

addToCart(item: CartItem): void {
  const current = this.cartItems.getValue();
  this.cartItems.next([...current, item]);
}

// ReplaySubject = nhớ N giá trị gần nhất, emit khi subscribe
const replay = new ReplaySubject<number>(3);  // nhớ 3 giá trị
```

---

## 6. Routing

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // Lazy loading (tương đương dynamic import + React.lazy)
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],    // Route guard
  },

  // Standalone component lazy loading (Angular 14+)
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(c => c.ProfileComponent),
  },

  // Dynamic routes — tương đương [id] trong Next.js
  { path: 'users/:id', component: UserDetailComponent },

  // Nested routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },  // 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',  // Scroll to top on navigation
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Template Routing

```html
<!-- RouterLink — tương đương <Link href=""> trong Next.js -->
<a routerLink="/home">Home</a>
<a [routerLink]="['/users', user.id]">{{ user.name }}</a>
<a routerLink="/users" [queryParams]="{ page: 2 }">Page 2</a>

<!-- routerLinkActive — tương đương pathname === href -->
<a routerLink="/home" routerLinkActive="active-class">Home</a>

<!-- Router outlet — tương đương {children} trong Next.js layout -->
<router-outlet></router-outlet>
```

### Programmatic Navigation

```typescript
import { Router, ActivatedRoute } from '@angular/router';

@Component({ ... })
export class UserComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Đọc route params — tương đương useParams()
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadUser(id);
    });

    // Đọc query params — tương đương useSearchParams()
    this.route.queryParams.subscribe(params => {
      const page = params['page'] || 1;
    });
  }

  goToUser(id: number): void {
    // Tương đương router.push() trong Next.js
    this.router.navigate(['/users', id]);
    this.router.navigate(['/users'], { queryParams: { page: 2 } });
    this.router.navigateByUrl('/home');
  }
}
```

### Route Guards

```typescript
// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn$.pipe(
      map(isLoggedIn =>
        isLoggedIn ? true : this.router.createUrlTree(['/login'])
      )
    );
  }
}

// Angular 14+: Functional guards (không cần class)
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn() || router.createUrlTree(['/login']);
};
```

---

## 7. Forms

### Template-driven Forms

> Đơn giản, dùng ngModel. Phù hợp với form nhỏ.

```html
<!-- Cần import FormsModule -->
<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
  <input
    name="email"
    [(ngModel)]="email"
    required
    email
    #emailInput="ngModel"
  >
  <div *ngIf="emailInput.invalid && emailInput.touched">
    <p *ngIf="emailInput.errors?.['required']">Email là bắt buộc</p>
    <p *ngIf="emailInput.errors?.['email']">Email không hợp lệ</p>
  </div>

  <button [disabled]="userForm.invalid">Submit</button>
</form>
```

### Reactive Forms (Khuyến nghị)

> Tương đương React Hook Form. Mạnh hơn, testable, dùng TypeScript tốt hơn.

```typescript
// Cần import ReactiveFormsModule
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({ ... })
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [''],
      address: this.fb.group({     // Nested group
        street: [''],
        city: ['', Validators.required],
      }),
      phones: this.fb.array([]),   // Dynamic array
    }, {
      validators: passwordMatchValidator,  // Cross-field validation
    });

    // Watch value changes — tương đương watch() trong RHF
    this.form.get('email')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(email => this.checkEmailExists(email));
  }

  // Getters cho convenience
  get nameControl() { return this.form.get('name')!; }
  get phonesArray() { return this.form.get('phones') as FormArray; }

  addPhone(): void {
    this.phonesArray.push(this.fb.control('', Validators.required));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    // gọi API...
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="name">
  <div *ngIf="nameControl.invalid && nameControl.touched">
    <p *ngIf="nameControl.errors?.['required']">Bắt buộc</p>
    <p *ngIf="nameControl.errors?.['minlength']">Tối thiểu 2 ký tự</p>
  </div>

  <div formGroupName="address">
    <input formControlName="city">
  </div>

  <div formArrayName="phones">
    <div *ngFor="let ctrl of phonesArray.controls; let i = index">
      <input [formControlName]="i">
    </div>
  </div>

  <button [disabled]="form.invalid" type="submit">Đăng ký</button>
</form>
```

### Custom Validator

```typescript
// Tương đương .refine() trong Zod
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Function validator
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

// Async validator (check server-side)
export function emailExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkEmail(control.value).pipe(
      map(exists => exists ? { emailExists: true } : null),
      catchError(() => of(null)),
    );
  };
}
```

---

## 8. Pipes (Built-in & Custom)

> Tương đương utility functions trong React, nhưng dùng trong template.

```html
<!-- Built-in pipes -->
{{ price | currency:'VND':'symbol':'1.0-0' }}
{{ date | date:'dd/MM/yyyy HH:mm' }}
{{ name | uppercase }}
{{ text | titlecase }}
{{ data | json }}                           <!-- Debug -->
{{ longText | slice:0:100 }}
{{ users | async }}                          <!-- Unwrap Observable -->
```

### Async Pipe — Quan trọng

```typescript
// Thay vì subscribe trong component (phải tự unsubscribe)
users: User[] = [];
ngOnInit() { this.service.getUsers().subscribe(u => this.users = u); }

// Dùng async pipe — tự động unsubscribe!
users$ = this.service.getUsers();
```

```html
<!-- Template -->
<div *ngIf="users$ | async as users; else loading">
  <li *ngFor="let user of users">{{ user.name }}</li>
</div>
<ng-template #loading>Loading...</ng-template>
```

### Custom Pipe

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, ellipsis = '...'): string {
    if (!value || value.length <= limit) return value;
    return value.substring(0, limit) + ellipsis;
  }
}
```

```html
{{ longText | truncate:50:'...' }}
```

---

## 9. Directives

> Directives = custom HTML attributes / behaviors.

### Structural Directive (thay đổi DOM)

```typescript
// Tạo custom *ngIf version
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective {
  @Input() set appHasRole(role: string) {
    if (this.authService.hasRole(role)) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else {
      this.vcr.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef,
    private authService: AuthService,
  ) {}
}
```

```html
<button *appHasRole="'admin'">Delete User</button>
```

### Attribute Directive (thay đổi appearance/behavior)

```typescript
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
  }
}
```

```html
<p appHighlight="lightblue">Hover me</p>
```

---

## 10. Change Detection

> Đây là concept không có trong React. Hiểu điều này giúp optimize performance.

### Default vs OnPush

```typescript
// Default: Angular check TOÀN BỘ component tree sau mỗi event
// OnPush: Chỉ check khi @Input reference thay đổi, event xảy ra trong component,
//         hoặc async pipe emit — PERFORMANCE TỐT HƠN

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,  // Tốt nhất cho perf
  template: `...`
})
export class UserCardComponent {
  @Input() user!: User;  // Chỉ re-render khi user reference thay đổi

  // Nếu cần force update:
  constructor(private cdr: ChangeDetectorRef) {}

  forceUpdate(): void {
    this.cdr.markForCheck();    // Schedule check
    // this.cdr.detectChanges(); // Synchronous check
  }
}
```

### Luôn dùng OnPush + async pipe + immutable data để tối ưu

```typescript
// ❌ Mutable mutation → OnPush không detect
this.users.push(newUser);

// ✅ New reference → OnPush detect
this.users = [...this.users, newUser];
```

---

## 11. HTTP Client

```typescript
// app.module.ts: import HttpClientModule
// hoặc Angular 15+: provideHttpClient() trong app.config.ts

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  // GET với params
  getUsers(page: number, search: string): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('search', search);
    return this.http.get<PaginatedResponse<User>>(`${this.baseUrl}/users`, { params });
  }

  // POST với headers
  createUser(user: CreateUserDto): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(`${this.baseUrl}/users`, user, { headers });
  }
}
```

### HTTP Interceptors — Tương đương axios interceptors

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(req);
  }
}

// Đăng ký interceptor trong app.module.ts
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
]
```

---

## 12. State Management

### Services + BehaviorSubject (đơn giản)

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);

  getItems(): Observable<CartItem[]> { return this.items$.asObservable(); }

  addItem(item: CartItem): void {
    this.items$.next([...this.items$.getValue(), item]);
  }

  removeItem(id: number): void {
    this.items$.next(this.items$.getValue().filter(i => i.id !== id));
  }

  get total(): number {
    return this.items$.getValue().reduce((sum, i) => sum + i.price, 0);
  }
}
```

### NgRx (Angular's Redux)

> Dùng khi app lớn, cần predictable state. Tương đương Redux Toolkit.

```bash
ng add @ngrx/store @ngrx/effects @ngrx/devtools
```

```typescript
// users.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

// users.reducer.ts
import { createReducer, on } from '@ngrx/store';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = { users: [], loading: false, error: null };

export const usersReducer = createReducer(
  initialState,
  on(loadUsers, state => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
);

// users.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(error => of(loadUsersFailure({ error: error.message }))),
        )
      )
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}

// Trong component
@Component({ ... })
export class UserListComponent {
  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUsersLoading);

  constructor(private store: Store) {
    this.store.dispatch(loadUsers());
  }
}
```

### Angular Signals (Angular 16+ — Modern approach)

> Angular's answer to React's useState, giống Solid.js signals.

```typescript
import { signal, computed, effect } from '@angular/core';

@Component({ ... })
export class CounterComponent {
  // signal() = useState()
  count = signal(0);
  name = signal('Angular');

  // computed() = useMemo()
  doubled = computed(() => this.count() * 2);
  greeting = computed(() => `Hello, ${this.name()}!`);

  // effect() = useEffect()
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment(): void {
    this.count.update(c => c + 1);  // tương đương setState(prev => prev + 1)
    // this.count.set(10);           // tương đương setState(10)
  }
}
```

```html
<!-- Gọi signal như function trong template -->
<p>Count: {{ count() }}</p>
<p>Doubled: {{ doubled() }}</p>
```

---

## 13. ViewChild & ContentChild

```typescript
// ViewChild — tương đương useRef() trong React
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  template: `
    <input #searchInput type="text">
    <app-chart #chart [data]="data"></app-chart>
  `
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild(ChartComponent) chart!: ChartComponent;

  ngAfterViewInit(): void {
    // DOM đã sẵn sàng — tương đương useEffect với ref
    this.searchInput.nativeElement.focus();
    this.chart.refresh();
  }
}
```

---

## 14. Testing

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());  // Đảm bảo không còn request pending

  it('should fetch users', () => {
    const mockUsers: User[] = [{ id: 1, name: 'John' }];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);  // Simulate response
  });
});

// user-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, name: 'John', active: true };
    fixture.detectChanges();
  });

  it('should display user name', () => {
    const el = fixture.nativeElement.querySelector('h2');
    expect(el.textContent).toContain('John');
  });

  it('should emit delete event on button click', () => {
    spyOn(component.delete, 'emit');
    const btn = fixture.nativeElement.querySelector('[data-testid="delete-btn"]');
    btn.click();
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });
});
```

---

## 15. Cấu trúc Project thực tế

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── api.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── core.module.ts
│   │
│   ├── shared/                  # Shared components, pipes, directives
│   │   ├── components/
│   │   │   ├── button/
│   │   │   └── modal/
│   │   ├── pipes/
│   │   │   └── truncate.pipe.ts
│   │   ├── directives/
│   │   │   └── highlight.directive.ts
│   │   └── shared.module.ts
│   │
│   ├── features/                # Feature modules (tương đương app/ routes trong Next.js)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.module.ts
│   │   ├── dashboard/
│   │   └── users/
│   │       ├── user-list/
│   │       │   ├── user-list.component.ts
│   │       │   ├── user-list.component.html
│   │       │   ├── user-list.component.scss
│   │       │   └── user-list.component.spec.ts
│   │       ├── user-detail/
│   │       ├── services/
│   │       │   └── user.service.ts
│   │       ├── models/
│   │       │   └── user.model.ts
│   │       └── users.module.ts
│   │
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
│
├── environments/
│   ├── environment.ts           # Dev config
│   └── environment.prod.ts      # Prod config
│
└── styles/
    ├── _variables.scss
    └── styles.scss
```

---

## 16. Interview Tips — React vs Angular

### Câu hỏi thường gặp khi phỏng vấn Angular

**Q: Angular khác React như thế nào?**
> Angular là full framework (router, forms, HTTP, DI tích hợp sẵn), React chỉ là UI library. Angular dùng TypeScript bắt buộc, có module system, DI pattern, và hai-way binding. React dùng JSX, unidirectional data flow, và bạn tự chọn libraries.

**Q: Two-way binding trong Angular là gì?**
> `[(ngModel)]` = `[ngModel]` (property binding) + `(ngModelChange)` (event binding). Tương đương `value={state}` + `onChange={setState}` trong React.

**Q: Observable vs Promise?**
> Observable là lazy (không chạy cho đến khi subscribe), có thể hủy (unsubscribe), emit nhiều values, có operators mạnh. Promise là eager, không hủy được, chỉ resolve/reject một lần.

**Q: ChangeDetection.OnPush là gì và tại sao dùng?**
> Mặc định Angular check toàn bộ component tree. OnPush chỉ check khi @Input reference thay đổi hoặc async pipe emit. Performance tốt hơn nhiều, đặc biệt với app lớn.

**Q: Dependency Injection trong Angular hoạt động thế nào?**
> Angular có IoC container tự động. Bạn đăng ký service với `@Injectable({ providedIn: 'root' })`, Angular tự inject vào constructor khi component/service cần. Giống Spring DI trong Java.

**Q: Signals trong Angular là gì?**
> Angular 16+ signals là reactive primitive, tương tự useState trong React hay signals trong SolidJS. `signal()`, `computed()`, `effect()` thay thế dần RxJS cho UI state.

**Q: Khi nào dùng Template-driven vs Reactive Forms?**
> Template-driven: form đơn giản, ít validation, prototype nhanh. Reactive: form phức tạp, nhiều validation, cần testability, dynamic fields — gần như luôn dùng Reactive.

---

## 17. Quick Reference — React → Angular mapping

| React | Angular |
|---|---|
| `useState(value)` | Class property / `signal(value)` |
| `useEffect(() => {}, [])` | `ngOnInit()` |
| `useEffect(() => { return cleanup }, [])` | `ngOnDestroy()` với `takeUntil(destroy$)` |
| `useMemo(() => x, [deps])` | `computed(() => x)` (signals) |
| `useRef()` | `@ViewChild()` / `ElementRef` |
| `useContext()` | Inject service |
| `props.children` | `<ng-content>` |
| `React.lazy()` | `loadChildren` / `loadComponent` |
| `key` in list | `trackBy` function |
| `dangerouslySetInnerHTML` | `[innerHTML]` |
| `className` | `class` (hoặc `[ngClass]`) |
| `onClick` | `(click)` |
| `onChange` | `(change)` / `(input)` |
| Render props | Structural directives |
| HOC | Directives / Services |
| Portal | CDK Overlay / `createPortal` |
