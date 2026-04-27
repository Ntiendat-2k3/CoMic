# 📖 TruyenHay (CoMic Web)

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

**TruyenHay** (Tên dự án: `CoMic`) là một ứng dụng web đọc truyện tranh hiện đại, hiệu suất cao và hoàn toàn responsive được xây dựng bằng Next.js 15 App Router. Ứng dụng tận dụng OTruyen API để cung cấp một thư viện phong phú các thể loại Manga, Manhwa, và Manhua cho người dùng đọc trực tuyến miễn phí.

## ✨ Các tính năng nổi bật

- **🚀 Next.js 15 App Router**: Xây dựng với các tính năng mới nhất của Next.js giúp tối ưu hóa hiệu suất và SEO.
- **🔐 Xác thực người dùng (Authentication)**: Đăng nhập, đăng ký và quản lý phiên làm việc an toàn thông qua [Clerk](https://clerk.com/).
- **📱 Progressive Web App (PWA)**: Có thể cài đặt trên các thiết bị di động và máy tính (desktop). Hỗ trợ lưu trữ offline giúp trải nghiệm đọc không bị gián đoạn.
- **📚 Thư viện truyện phong phú**: Lấy dữ liệu truyện, thể loại, và các chương mới nhất theo thời gian thực từ OTruyen API.
- **🔍 Tìm kiếm & Lọc nâng cao**: Dễ dàng tìm kiếm truyện theo từ khóa, thể loại hoặc trạng thái (mới cập nhật, đang tiến hành, đã hoàn thành).
- **📖 Trải nghiệm đọc tối ưu**: Đọc truyện mượt mà và tải trang nhanh chóng nhờ việc ứng dụng danh sách ảo (virtualized lists thông qua `react-window` & `react-virtualized-auto-sizer`) để hiển thị hàng ngàn hình ảnh mà không bị giật lag.
- **💾 Lưu trữ ngoại tuyến & Local**: Tính năng theo dõi lịch sử đọc và truyện yêu thích được lưu cục bộ trên trình duyệt thông qua IndexedDB (`idb`) và Redux Toolkit.
- **⚡ Tìm nạp & Caching dữ liệu nhanh**: Quản lý API và state hiệu quả với `@tanstack/react-query` và `lru-cache`.
- **🎨 UI/UX Hiện đại**: Được thiết kế bắt mắt với Tailwind CSS, Sass, Headless UI, và các hiệu ứng mượt mà từ Framer Motion.

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **CSS / Styling**: [Tailwind CSS](https://tailwindcss.com/), [Sass](https://sass-lang.com/)
- **Quản lý State (State Management)**: [Redux Toolkit](https://redux-toolkit.js.org/), [React Query](https://tanstack.com/query/latest)
- **Xác thực**: [Clerk](https://clerk.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **Hiệu ứng Animation**: [Framer Motion](https://www.framer.com/motion/)
- **PWA**: `next-pwa`
- **Cơ sở dữ liệu / Bộ nhớ cục bộ**: IndexedDB (`idb`)
- **Icons**: `lucide-react`, `react-icons`
- **Thành phần UI (UI Components)**: `@headlessui/react`, `notyf` (hiển thị thông báo), `react-paginate`

## 📁 Cấu trúc thư mục

```text
src/
├── app/               # Các trang theo cơ chế App Router của Next.js 15 (Trang chủ, Chi tiết truyện, Tìm kiếm, v.v.)
├── components/        # Các component giao diện dùng chung (Layout, Card Truyện, Giao diện đọc Chapter, v.v.)
├── hooks/             # Custom React hooks
├── lib/               # Các hàm tiện ích, cấu hình gọi API và hằng số
├── providers/         # Các Context Providers (Clerk, Redux, React Query, Giao diện/Theme)
├── services/          # API Services (chẳng hạn như otruyen.service.ts để gọi data bên ngoài)
├── store/             # Cấu hình Redux slices và store
└── types/             # Định nghĩa Type / Interface của TypeScript
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

Hãy đảm bảo máy tính của bạn đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên) và trình quản lý gói như `npm`, `yarn`, `pnpm` hoặc `bun`.

### 1. Clone dự án (Tải mã nguồn)

```bash
git clone https://github.com/Ntiendat-2k3/CoMic.git
cd CoMic
```

### 2. Cài đặt các thư viện phụ thuộc

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình biến môi trường

Tạo một tệp `.env.local` ở thư mục gốc của dự án và thêm vào các biến môi trường sau (chủ yếu là cấu hình cho Clerk Auth):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Bạn có thể lấy key API của Clerk từ trang quản trị [Clerk Dashboard](https://dashboard.clerk.dev))*

### 4. Chạy dự án ở môi trường phát triển (Development)

Khởi động Next.js server với Turbopack để quá trình build nhanh hơn:

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở trình duyệt và truy cập vào [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📦 Build cho môi trường Production

Để tối ưu hóa mã nguồn và chạy ứng dụng trên môi trường thực tế (production):

```bash
npm run build
npm run start
```

## 🌍 SEO & Hiệu suất

- Được tinh chỉnh `metadata` đầy đủ trong `layout.tsx` cho thẻ Open Graph và Twitter.
- Tự động tạo `sitemap.ts` và `robots.ts` động.
- Sử dụng Next.js App Router hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG).
- Tích hợp sẵn PWA với `manifest.json` và service worker để tự động cache các tài nguyên.

## 🤝 Đóng góp

Chào đón tất cả các đóng góp, báo cáo lỗi (issues) hoặc yêu cầu tính năng! Bạn có thể xem và tạo issue tại Github của dự án.

## 📄 Giấy phép (License)

Dự án này là mã nguồn mở và được cấp phép theo [MIT License](LICENSE).
