# TruyenHay (CoMic Web)

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase_Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

**TruyenHay** (Tên dự án: `CoMic`) là một ứng dụng web đọc truyện tranh đa nền tảng (PWA) hiệu suất cao, được xây dựng với kiến trúc **Next.js 15 App Router**. Ứng dụng sử dụng MangaDex API để cung cấp Manga, Manhwa và Manhua có bản dịch tiếng Việt hoặc tiếng Anh.

## Case Study (Mô tả dự án)

- **Vấn đề (Problem):** Thiết kế một nền tảng đọc truyện tranh đa thiết bị (PWA) giúp người dùng duyệt và đọc mượt mà từ kho dữ liệu khổng lồ, theo dõi được tiến trình đọc mà không gặp trở ngại về tốc độ tải trang hay giật lag.
- **Thách thức (Challenge):** Xử lý render hàng chục đến hàng trăm hình ảnh chất lượng cao trong cùng một chương truyện mà không làm tràn bộ nhớ (RAM) của trình duyệt trên các thiết bị di động. Đồng thời, phải quản lý đồng bộ trạng thái lịch sử đọc và danh sách yêu thích một cách mượt mà giữa Client và Local Storage.
- **Giải pháp (Solution):** 
  - Ứng dụng kỹ thuật **Virtualized Lists** (chỉ render các hình ảnh đang hiển thị trong khung hình) để tối ưu hóa tuyệt đối bộ nhớ. 
  - Kết hợp kiến trúc **Next.js 15 (SSR/SSG)** để tối ưu tốc độ tải và SEO. 
  - Sử dụng kết hợp **Redux Toolkit, React Query và IndexedDB** để caching dữ liệu API và quản lý state nội bộ, mang lại trải nghiệm offline-ready và mượt mà như một ứng dụng Native thực thụ.

## Chức năng chính dành cho người dùng

- **Đọc truyện trực tuyến mượt mà**: Giao diện đọc truyện thân thiện, tối ưu cho việc tải hàng nghìn hình ảnh cùng lúc mà không gây giật lag thiết bị.
- **Khám phá & Tìm kiếm truyện**: 
  - Dễ dàng duyệt các danh sách: *Truyện mới cập nhật*, *Đang phát hành*, *Đã hoàn thành*, *Tạm ngưng*.
  - Lọc truyện theo hàng chục **Thể loại** đa dạng (Action, Adventure, Romance, Manga, Manhwa...).
  - Thanh tìm kiếm thông minh giúp tra cứu truyện nhanh chóng theo từ khóa.
- **Lịch sử đọc truyện**: Tự động lưu lại tiến trình đọc, ghi nhớ chương đang đọc dở để bạn có thể tiếp tục ngay lập tức ở lần truy cập sau.
- **Theo dõi / Yêu thích (Bookmark)**: Cho phép đánh dấu các bộ truyện yêu thích, tự động gom vào danh sách cá nhân riêng để dễ dàng theo dõi chương mới.
- **Quản lý tài khoản**: Hỗ trợ người dùng đăng nhập/đăng ký tài khoản an toàn, nhanh chóng.
- **Trải nghiệm App thực thụ (PWA)**: Hỗ trợ hiển thị hoàn hảo trên mọi kích thước màn hình (Mobile, Tablet, PC). Hỗ trợ cài đặt trực tiếp vào thiết bị như một ứng dụng (PWA) để truy cập nhanh và sử dụng ngoại tuyến các dữ liệu đã lưu.

## Điểm nổi bật về Công nghệ (Technical Features)

- **Framework tiên tiến**: Next.js 15 App Router tối ưu SEO mạnh mẽ với SSR và SSG.
- **Authentication an toàn**: Tích hợp email/mật khẩu, khôi phục tài khoản và OAuth bằng [Supabase Auth](https://supabase.com/docs/guides/auth).
- **Quản lý State & Storage thông minh**: Dữ liệu lịch sử và yêu thích được lưu cục bộ an toàn qua IndexedDB (`idb`) & Redux Toolkit. Server state được quản lý và cache bằng `@tanstack/react-query` cùng cache bộ nhớ cho danh mục MangaDex.
- **Performance cực cao**: Sử dụng Virtualized Lists (`react-window`) kết hợp `ResizeObserver` để render nội dung chapter truyện, giúp tiết kiệm bộ nhớ trình duyệt tối đa.
- **Giao diện ấn tượng (UI/UX)**: Kết hợp Tailwind CSS, Sass và CSS transition để tạo trải nghiệm hình ảnh sắc nét, mượt mà.

## Công nghệ sử dụng (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **CSS / Styling**: [Tailwind CSS](https://tailwindcss.com/), [Sass](https://sass-lang.com/)
- **Quản lý State (State Management)**: [Redux Toolkit](https://redux-toolkit.js.org/), [React Query](https://tanstack.com/query/latest)
- **Xác thực**: [Supabase Auth](https://supabase.com/docs/guides/auth) với phiên cookie SSR
- **API Client**: [Axios](https://axios-http.com/)
- **PWA**: manifest động tại `src/app/manifest.ts` và Service Worker tùy chỉnh
- **Cơ sở dữ liệu / Bộ nhớ cục bộ**: IndexedDB (`idb`)
- **Icons**: `lucide-react`, `react-icons`
- **Thành phần UI (UI Components)**: `react-paginate`

## Cấu trúc thư mục

```text
src/
├── app/               # Route, metadata và các container theo App Router
├── components/        # Lớp presentation: component giao diện dùng chung
├── domain/            # Quy tắc nghiệp vụ và chuẩn hóa dữ liệu thuần TypeScript
├── features/          # Lớp application: controller hook theo từng tính năng
├── hooks/             # Hook hạ tầng dùng chung
├── i18n/              # Cấu hình, kiểu dữ liệu và provider đa ngôn ngữ
├── infrastructure/    # HTTP client, kiểu JSON và mapper riêng cho MangaDex
├── lib/               # Hạ tầng trình duyệt và cache
├── providers/         # Context Provider của i18n, Redux và React Query
├── services/          # Lớp truy cập nguồn dữ liệu bên ngoài
├── store/             # Redux slices và store
└── types/             # Kiểu dữ liệu dùng chung

public/locales/
└── vi.json            # Toàn bộ nội dung hiển thị của locale tiếng Việt
```

### Quản lý nội dung và thêm ngôn ngữ

- Chỉnh nội dung tiếng Việt tại `public/locales/vi.json`; component không chứa literal hiển thị.
- Nội dung động dùng placeholder dạng `{name}` và được định dạng bằng `formatMessage`.
- Server Component đọc dictionary qua `getDictionary`; Client Component đọc qua `useDictionary`.
- Khi thêm locale mới, tạo file JSON có cùng cấu trúc, khai báo locale trong `src/i18n/config.ts` và đăng ký dictionary trong `src/i18n/dictionaries.ts`.

## Hướng dẫn cài đặt

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

Sao chép `.env.example` thành `.env.local`, sau đó điền URL và publishable key từ phần **Project Settings → API** của Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
# Chỉ dùng trên server, tuyệt đối không thêm tiền tố NEXT_PUBLIC_
SUPABASE_SECRET_KEY=sb_secret_your_secret_key
# Không bắt buộc; mặc định là https://api.mangadex.org
NEXT_PUBLIC_MANGADEX_API_URL=https://api.mangadex.org
```

Chạy file migration `supabase/migrations/20260915060000_create_profiles.sql` trong **Supabase → SQL Editor**. Migration tạo bảng `profiles`, RLS, trigger đồng bộ người dùng và hàm kiểm tra username. Việc tắt **Automatically expose new tables** không ảnh hưởng vì migration đã cấp quyền cần thiết một cách tường minh.

Trong **Authentication → URL Configuration**, thêm `http://localhost:3000/auth/callback` và callback tương ứng của production vào danh sách Redirect URLs. Bật Email/Password và Google trong **Authentication → Providers**. Với dự án thử nghiệm chưa có SMTP riêng, Supabase chỉ gửi email xác nhận đến thành viên của dự án; hãy cấu hình **Authentication → SMTP Settings** trước khi mở đăng ký cho người dùng khác.

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

## Build cho môi trường Production

Để tối ưu hóa mã nguồn và chạy ứng dụng trên môi trường thực tế (production):

```bash
npm run build
npm run start
```

## SEO & Hiệu suất

- Được tinh chỉnh `metadata` đầy đủ trong `layout.tsx` cho thẻ Open Graph và Twitter.
- Tự động tạo `sitemap.ts` và `robots.ts` động.
- Sử dụng Next.js App Router hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG).
- Tích hợp sẵn PWA với manifest động và service worker để tự động cache các tài nguyên.

## 🤝 Đóng góp

Chào đón tất cả các đóng góp, báo cáo lỗi (issues) hoặc yêu cầu tính năng! Bạn có thể xem và tạo issue tại Github của dự án.

## 📄 Giấy phép (License)

Dự án này là mã nguồn mở và được cấp phép theo [MIT License](LICENSE).
