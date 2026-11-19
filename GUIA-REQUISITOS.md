# AppColaboradores — Proyecto Módulo 1

App NativeScript + Angular creada a partir del template oficial
`@nativescript/template-drawer-navigation-ng` (v9.1.2), con un módulo nuevo
"Colaboradores" (directorio de empleados).

## Cómo ejecutarla

```bash
cd D:\Curso_Coursera\AppColaboradores
npm install
ns run android        # con el emulador abierto o un celular conectado
```

> El comando moderno es `ns` (antes `tns`). Si `npm install` falla con
> "Cannot read properties of null (reading 'edgesOut')", actualiza npm:
> `npm install -g npm@latest`.

## Dónde se cumple cada requisito

| # | Requisito | Dónde está |
|---|-----------|-----------|
| 1 | Basado en template-drawer-navigation-ng, con enrutador modularizado en features | `src/app/app-routing.module.ts` (rutas `loadChildren` por feature: home, browse, search, featured, settings) y cada carpeta con su `*.module.ts` + `*-routing.module.ts` |
| 2 | Al menos 2 componentes nuevos | `src/app/colaboradores/colaboradores-lista.component.ts` y `colaborador-detalle.component.ts` |
| 3 | Nuevo módulo de features | `src/app/colaboradores/colaboradores.module.ts` |
| 4 | Submódulo de ruteo del nuevo módulo | `src/app/colaboradores/colaboradores-routing.module.ts` (`forChild`, rutas `''` y `detalle/:id`) |
| 5 | Navegación integrada al side drawer | `src/app/app.component.html` (ítem "Colaboradores") + ruta `colaboradores` en `app-routing.module.ts` |
| 6 | Service nuevo inyectado a nivel global | `src/app/domain/colaboradores.service.ts`, registrado en `providers` de `src/app/app.module.ts`; lo usan `HomeComponent` y los dos componentes de Colaboradores |
| 7 | Vista con `*ngFor` | `src/app/colaboradores/colaboradores-lista.component.html` |
| 8 | CSS con sobrecarga de nombres Android/iOS | `colaboradores-lista.component.android.css` (verde, sombra) y `colaboradores-lista.component.ios.css` (azul, bordes redondeados); ambos importan `colaboradores-lista.common.css` |
| 9 | Ícono personalizado en App_Resources | `App_Resources/Android/src/main/res/drawable-*/ic_colaboradores.png` y `App_Resources/iOS/Assets.xcassets/ic_colaboradores.imageset/`; se usa con `res://ic_colaboradores` en la lista |
| 10 | Variable asignada solo en Android | `colaboradores-lista.component.ts`, en `ngOnInit()`: `if (isAndroid) { this.mensajePlataforma = ... }` |

---

# Proyecto Módulo 2 — Capacitaciones, formularios, gestos, animaciones y splash

Se agregó la sección **Capacitaciones** (catálogo de capacitaciones internas con
opiniones) y la página **Buscar**. Plugins nuevos:
`@nativescript-community/ui-pulltorefresh` (sucesor de `nativescript-pulltorefresh`)
y `@triniwiz/nativescript-toasty` (toast).

```bash
npm install
ns run android
```

## Dónde se cumple cada requisito

| # | Requisito | Dónde está |
|---|-----------|-----------|
| 1 | Página de búsqueda con `ListView` y plantilla anidada `FlexboxLayout` | `src/app/search/search.component.html` (menú lateral → **Buscar**). Cada resultado es un `FlexboxLayout` con imagen + otro `FlexboxLayout` en columna con los textos. La pantalla de **Capacitaciones** usa la misma estructura |
| 2 | Navegación de listado a detalle con `RouterExtensions.navigate` | `capacitaciones-lista.component.ts` → `onItemTap()` y `search.component.ts` → `verDetalle()`: `routerExtensions.navigate(['/capacitaciones/detalle', id])`. Ruta `detalle/:id` en `capacitaciones-routing.module.ts` |
| 3 | Pull to refresh que agrega elementos | `capacitacion-detalle.component.html`: `<PullToRefresh (refresh)="onPull($event)">` envuelve el `ListView` de opiniones; `onPull()` agrega una opinión aleatoria del servicio con `unshift`. El elemento se registra en `src/main.ts` con `registerElement` |
| 4 | Diálogo tipo *action* que modifica un atributo | Ícono de etiqueta en cada ítem de **Capacitaciones** → `elegirCategoria()` usa `Dialogs.action(...)` y cambia `capacitacion.area` mediante `CapacitacionesService.cambiarArea()` |
| 5 | Toast | `src/app/shared/toast.ts` (`mostrarToast`). Se usa al cambiar categoría, al buscar, al refrescar opiniones, al inscribirse y en el *long press* |
| 6 | Two way binding `[()]` en un formulario | `search.component.html`: `<TextField [(ngModel)]="texto">` (módulo `NativeScriptFormsModule` en `search.module.ts`) |
| 7 | Validador personalizado con directiva Angular | `src/app/shared/minlen-validator.directive.ts` (`[minlen][ngModel]`, provee `NG_VALIDATORS`, retorna `{ minlen: true }` o `null`). En la vista: `minlen="3" #campo="ngModel"`, el botón se deshabilita con `campo.valid` y se muestra el error con `*ngIf="campo.hasError('minlen')"` |
| 8 | Detección de gestos | Detalle de capacitación: corazón con `(doubleTap)` para inscribirse; cada opinión tiene `(longPress)` que muestra un toast |
| 9 | Animación en un ícono | `capacitacion-detalle.component.ts` → `animarIcono()`: `view.animate({ rotate: 360, scale, backgroundColor })` al hacer doble tap |
| 10 | Splash screen personalizado para Android | `App_Resources/Android/src/main/res/drawable-nodpi/splash_screen.xml` (fondo `@color/splash_background` + `splash_logo.png` en `drawable-*dpi`), color en `values/colors.xml` y `values-v31/styles.xml` para la *SplashScreen API* de Android 12+ (`splash_icon.png`) |

Extra: la búsqueda muestra un `ActivityIndicator` mientras "consulta" el servicio.

---

# Proyecto Módulo 3 — API Express + ngrok, configuración persistente y Redux

Plugins/paquetes nuevos: `@ngrx/store` (Redux para Angular) en la app y `express` en `api/`.

## Cómo ejecutarlo (3 terminales)

```bash
# 1) API
cd api
npm install
npm start
# 2) Túnel
ngrok http 3000
# 3) App
ns run android
```

En la app: **Settings → Editar** y pegar la URL `https://xxxx.ngrok-free.app` que muestra ngrok.

## Dónde se cumple cada requisito

| # | Requisito | Dónde está |
|---|-----------|-----------|
| 1 | App Express con webservice GET y filtrado por querystring | `api/index.js`: `GET /api/capacitaciones?q=texto` filtra por nombre, área o descripción |
| 2 | Listado con formulario de búsqueda (caja de texto + botón) que filtra | `src/app/search/search.component.html` (menú → **Buscar**): `TextField` con `[(ngModel)]`, botón **Buscar** y `ListView` de resultados |
| 3 | Variable de configuración con la URL de ngrok y conexión por HTTP desde un Service | `src/app/config.ts` (`CONFIG.apiUrl`), editable sin recompilar en Settings y guardada con `ApplicationSettings` (`domain/ajustes.service.ts` → `getApiUrl()`) |
| 4 | Service de Angular que hace la solicitud HTTP | `src/app/domain/capacitaciones-api.service.ts` usa `HttpClient` (`NativeScriptHttpClientModule` en `app.module.ts`); el componente solo se suscribe a `buscar()` |
| 5 | Sección Settings que lee el nombre de usuario persistente | `src/app/settings/settings.component.*` lee `ApplicationSettings.getString('nombreUsuario', 'Invitado')`. También se muestra en el encabezado del menú y en Home |
| 6 | Pantalla para editar el nombre de usuario y persistirlo | `src/app/settings/editar-usuario.component.*` (ruta `settings/editar`): `[(ngModel)]` + validador `minlen` y `ApplicationSettings.setString(...)` |
| 7 | Ícono para guardar como favorito en la búsqueda | Estrella en cada resultado de **Buscar** → `FavoritosService.alternar()` (`domain/favoritos.service.ts`, también persistido) |
| 8 | Favoritos listados en la sección "Favoritos" | `src/app/favoritos/` (menú → **Favoritos**, reemplaza a "Featured") |
| 9 | Botón "Leer ahora" que despacha una acción a Redux | `favoritos.component.ts` → `store.dispatch(leerAhora({ capacitacion }))`. Acciones en `store/leidos.actions.ts`, reducer en `store/leidos.reducer.ts`, Store registrado con `StoreModule.forRoot(reducers)` en `app.module.ts` |
| 10 | En la pantalla principal, listado reactivo de los "Leer ahora" con `select` | `src/app/home/home.component.ts`: `this.store.select(selectLeidos)` y en la vista `[items]="leidos$ | async"`; selectores en `store/app.state.ts` |

---

# Proyecto Módulo 4 — Capacidades nativas y pruebas automáticas

Plugins nuevos: `@nativescript/firebase-core`, `@nativescript/firebase-messaging`,
`@nativescript/social-share`, `@nativescript/camera`, `@nativescript/google-maps`.
Pruebas: `@nativescript/unit-test-runner`, `karma`, `karma-jasmine`, `karma-nativescript-launcher`, `karma-junit-reporter`.

Configuración con cuentas propias:

- **Firebase:** `App_Resources/Android/src/google-services.json` del proyecto Firebase propio (`appcolaboradores-a446c`, app Android `org.nativescript.AppColaboradores`). Por seguridad el archivo real no se publica; en el repositorio está `google-services.example.json` con la misma estructura y la API key oculta. Para compilar hay que descargar el propio desde la consola de Firebase.
- **Google Maps:** API key propia. Por seguridad no está en el repositorio: va en `App_Resources/Android/secrets.properties` (ignorado por git; ver `secrets.properties.example`) y `app.gradle` la inyecta en `AndroidManifest.xml` (`com.google.android.geo.API_KEY` = `${MAPS_API_KEY}`).

## Dónde se cumple cada requisito

| # | Requisito | Dónde está |
|---|-----------|-----------|
| 1 | Token de Firebase (integración con claves propias) para enviar notificaciones desde la consola | `src/app/domain/notificaciones.service.ts` (`firebase().initializeApp()`, `messaging().getToken()`); el token se muestra en menú → **Notificaciones** y en la terminal (`TOKEN FIREBASE:`). Claves en `google-services.json` |
| 2 | Toast con las notificaciones entrantes | `notificaciones.service.ts` → `messaging().onMessage(...)` llama a `mostrarToast(...)` y agrega la notificación a la lista de la pantalla Notificaciones |
| 3 | social-share de texto | Detalle de capacitación → menú ⋮ → **Compartir** (`shareText`) y Notificaciones → **Compartir token** |
| 4 | social-share de imagen | Detalle de capacitación → menú ⋮ → **Compartir imagen** (`shareImage`) |
| 5 | Plugin `camera` para tomar fotos | Menú → **Cámara** → **Tomar foto** (`src/app/camara/camara.component.ts`: `requestPermissions()` + `takePicture()`) |
| 6 | La foto de la cámara se comparte con social-share | Menú → **Cámara** → **Compartir foto** (`shareImage(foto)`) |
| 7 | Plugin de Google Maps con cuenta propia | Menú → **Mapa** (`src/app/mapa/`), `GoogleMapsModule` + `<MapView>`; API key propia inyectada desde `secrets.properties` (no publicada) |
| 8 | Marker en el mapa | `mapa.component.ts` → `onMapaListo()` agrega 3 markers con `map.addMarker(...)`; al tocar uno sale un toast |
| 9 | Suite de Jasmine que prueba un reducer de Redux | `src/tests/leidos.reducer.spec.ts`: 6 pruebas de `leidosReducer` (estado inicial, Leer ahora, orden, sin duplicados, inmutabilidad, limpiar) |
| 10 | Karma JUnit Reporter configurado y archivo de salida generado | `karma.conf.js`: `reporters: ['progress', 'junit']` + `junitReporter`. Al correr `ns test android` se genera `TESTS-NativeScript/resultados-pruebas.xml` |

## Cómo correr las pruebas unitarias (celular por USB)

```bash
adb reverse tcp:9876 tcp:9876
ns test android --justlaunch
```

El resultado queda en `TESTS-NativeScript/resultados-pruebas.xml`.
