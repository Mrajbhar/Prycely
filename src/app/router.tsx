import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '../components/layout/RootLayout';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AccountLayout } from '../components/layout/AccountLayout';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AdminRoute } from '../routes/AdminRoute';

import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import SearchPage from '../pages/SearchPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import WishlistPage from '../pages/WishlistPage';

// Content pages
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FaqPage from '../pages/FaqPage';
import ShippingReturnsPage from '../pages/ShippingReturnsPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';

import NotFoundPage from '../pages/NotFoundPage';

// Account pages
import AccountOverviewPage from '../pages/account/AccountOverviewPage';
import AccountOrdersPage from '../pages/account/AccountOrdersPage';
import AccountAddressesPage from '../pages/account/AccountAddressesPage';
import AccountWishlistPage from '../pages/account/AccountWishlistPage';
import AccountProfilePage from '../pages/account/AccountProfilePage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminProductFormPage from '../pages/admin/AdminProductFormPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // ---------- Public: storefront ----------
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:slug', element: <ProductDetailPage /> },
      { path: '/search', element: <SearchPage /> },

      // ---------- Public: auth ----------
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },

      // ---------- Public: content ----------
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/shipping-returns', element: <ShippingReturnsPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },

      // ---------- Signed-in customers ----------
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/cart', element: <CartPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/wishlist', element: <WishlistPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/orders/:id', element: <OrderDetailPage /> },

          // ---------- Account hub ----------
          {
            path: '/account',
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountOverviewPage /> },
              { path: 'orders', element: <AccountOrdersPage /> },
              { path: 'addresses', element: <AccountAddressesPage /> },
              { path: 'wishlist', element: <AccountWishlistPage /> },
              { path: 'profile', element: <AccountProfilePage /> },
            ],
          },
        ],
      },

      // ---------- Admin only ----------
      {
        element: <AdminRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'products', element: <AdminProductsPage /> },
              { path: 'products/new', element: <AdminProductFormPage /> },
              { path: 'products/:id/edit', element: <AdminProductFormPage /> },
              { path: 'categories', element: <AdminCategoriesPage /> },
              { path: 'orders', element: <AdminOrdersPage /> },
            ],
          },
        ],
      },

      // ---------- Fallback ----------
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);