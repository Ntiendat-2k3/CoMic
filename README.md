# 📖 TruyenHay (CoMic Web)

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

**TruyenHay** (Tên dự án: `CoMic`) là một ứng dụng web đọc truyện tranh đa nền tảng (PWA) hiệu suất cao, được xây dựng với kiến trúc **Next.js 15 App Router**. Ứng dụng tận dụng OTruyen API để cung cấp một thư viện phong phú các thể loại Manga, Manhwa, và Manhua cho người dùng đọc trực tuyến miễn phí.

## 💡 Case Study (Mô tả dự án)

- **🔴 Vấn đề (Problem):** Thiết kế một nền tảng đọc truyện tranh đa thiết bị (PWA) giúp người dùng duyệt và đọc mượt mà từ kho dữ liệu khổng lồ, theo dõi được tiến trình đọc mà không gặp trở ngại về tốc độ tải trang hay giật lag.
- **⚠️ Thách thức (Challenge):** Xử lý render hàng chục đến hàng trăm hình ảnh chất lượng cao trong cùng một chương truyện mà không làm tràn bộ nhớ (RAM) của trình duyệt trên các thiết bị di động. Đồng thời, phải quản lý đồng bộ trạng thái lịch sử đọc và danh sách yêu thích một cách mượt mà giữa Client và Local Storage.
- **✅ Giải pháp (Solution):** 
  - Ứng dụng kỹ thuật **Virtualized Lists** (chỉ render các hình ảnh đang hiển thị trong khung hình) để tối ưu hóa tuyệt đối bộ nhớ. 
  - Kết hợp kiến trúc **Next.js 15 (SSR/SSG)** để tối ưu tốc độ tải và SEO. 
  - Sử dụng kết hợp **Redux Toolkit, React Query và IndexedDB** để caching dữ liệu API và quản lý state nội bộ, mang lại trải nghiệm offline-ready và mượt mà như một ứng dụng Native thực thụ.

## 🎯 Chức năng chính dành cho người dùng

- **📖 Đọc truyện trực tuyến mượt mà**: Giao diện đọc truyện thân thiện, tối ưu cho việc tải hàng nghìn hình ảnh cùng lúc mà không gây giật lag thiết bị.
- **🔍 Khám phá & Tìm kiếm truyện**: 
  - Dễ dàng duyệt các danh sách: *Truyện mới cập nhật*, *Đã hoàn thành*, *Sắp ra mắt*.
  - Lọc truyện theo hàng chục **Thể loại** đa dạng (Action, Adventure, Romance, Manga, Manhwa...).
  - Thanh tìm kiếm thông minh giúp tra cứu truyện nhanh chóng theo từ khóa.
- **🕒 Lịch sử đọc truyện**: Tự động lưu lại tiến trình đọc, ghi nhớ chương đang đọc dở để bạn có thể tiếp tục ngay lập tức ở lần truy cập sau.
- **❤️ Theo dõi / Yêu thích (Bookmark)**: Cho phép đánh dấu các bộ truyện yêu thích, tự động gom vào danh sách cá nhân riêng để dễ dàng theo dõi chương mới.
- **🔐 Quản lý tài khoản**: Hỗ trợ người dùng đăng nhập/đăng ký tài khoản an toàn, nhanh chóng.
- **📱 Trải nghiệm App thực thụ (PWA)**: Hỗ trợ hiển thị hoàn hảo trên mọi kích thước màn hình (Mobile, Tablet, PC). Hỗ trợ cài đặt trực tiếp vào thiết bị như một ứng dụng (PWA) để truy cập nhanh và sử dụng ngoại tuyến các dữ liệu đã lưu.

## ✨ Điểm nổi bật về Công nghệ (Technical Features)

- **🚀 Framework tiên tiến**: Next.js 15 App Router tối ưu SEO mạnh mẽ với SSR và SSG.
- **🔐 Authentication an toàn**: Tích hợp luồng xác thực và quản lý user từ [Clerk](https://clerk.com/).
- **💾 Quản lý State & Storage thông minh**: Dữ liệu lịch sử và yêu thích được lưu cục bộ an toàn qua IndexedDB (`idb`) & Redux Toolkit. Server state được quản lý & caching hiệu quả bằng `@tanstack/react-query` và `lru-cache`.
- **⚡ Performance cực cao**: Sử dụng Virtualized Lists (`react-window`, `react-virtualized-auto-sizer`) để render nội dung chapter truyện, giúp tiết kiệm bộ nhớ trình duyệt tối đa.
- **🎨 Giao diện ấn tượng (UI/UX)**: Kết hợp Tailwind CSS, Sass, Headless UI cùng Framer Motion cho trải nghiệm hình ảnh sắc nét, mượt mà và chuyển cảnh bắt mắt.

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
