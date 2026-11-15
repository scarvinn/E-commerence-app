# Shoppe — React Native shopping demo

A mobile shopping prototype built with React Native and TypeScript. Browse a bundled product catalog, search and filter products, and manage a shared cart. Registration, login and optional avatar upload use an existing hosted API.

## What you can try

- **Browse without an account:** choose **Browse demo shop** on the welcome screen.
- **Find products:** search by name and filter Clothing, Accessories or Home.
- **Build a cart:** add products, increase/decrease quantities, remove individual products or confirm clearing the cart.
- **See prices:** USD prices, line totals and a subtotal calculated in integer cents; quantities are capped at 99 per product.
- **Register:** email/password form with matching-password validation and optional photo upload. Account creation still succeeds if uploading a photo fails.
- **Log in:** submit credentials to the hosted backend and open the shopping tabs.

The catalog is sample data, not live inventory. The cart lives in memory and resets on restart. There is no checkout, payment processing, shipping/tax calculation or saved orders. Profile is currently a placeholder. Login does not yet persist a session or attach an auth token to subsequent requests; guest browsing is intentional.

## Stack

React Native 0.84 · React 19 · TypeScript · React Navigation 7 · Axios · React Native Image Picker. Cart state uses React context and a reducer; no extra state dependency is needed for the demo.

## Run locally

Requires Node **22.11+**, npm, and the [React Native native development environment](https://reactnative.dev/docs/set-up-your-environment) for your target platform. iOS builds require macOS and Xcode; Android requires the Android SDK and an emulator or device.

```sh
npm ci
npm start
```

In another terminal:

```sh
npm run android
# or, on macOS after installing pods:
bundle install
cd ios
bundle exec pod install
cd ..
npm run ios
```

No API credentials are needed for the bundled shop/cart. Authentication and avatar upload require the hosted backend to be reachable. The Axios base URL and timeout are configured in [`src/services/axiosFunctions/api.ts`](src/services/axiosFunctions/api.ts). The backend source and deployment are not included here.

### API used by the prototype

| Request | Purpose |
| --- | --- |
| `POST /api/register/` | Create an account with email and password; signup expects a `userid` in the returned payload (or nested `data`). |
| `POST /api/login/` | Submit email and password. |
| `POST /api/avatar` | Upload multipart `image` and user `id`. |

## Check the code

```sh
npm run lint
npx tsc --noEmit
npm test -- --runInBand
```

Tests cover cart arithmetic and quantity limits, product filtering, shared shop/cart interactions and signup behavior. Native device checks are still required for image selection, uploads, keyboard layout and platform rendering.

## Source map

```text
src/common/                 Shared inputs, buttons and photo picker
src/features/shop/          Demo catalog, filtering, money formatting and styles
src/features/cart/          Cart reducer, totals and shared context
src/features/components/    Welcome, auth, shop, cart and profile screens
src/navigation/             Stack and bottom tabs
src/services/axiosFunctions/ API client and auth/upload requests
__tests__/                  Automated tests
```

## Manual demo

1. Open the app and tap **Browse demo shop**.
2. Search for `mug`, then clear the search and try **Clothing**.
3. Add the same T-shirt twice. Open **Cart**: quantity should be 2 and subtotal $48.00.
4. Decrease to 1, then remove it. The empty-cart message should appear.
5. Add products, select **Clear cart**, and try both Cancel and Clear cart.
6. Restart the app to confirm the cart resets.

## Next steps

- Persist the cart and add real product inventory.
- Define the backend auth contract, secure token storage and logout.
- Build profile editing and saved orders.
- Connect checkout only after a server-side order and price-validation API exists.
