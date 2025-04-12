const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-8 py-6">
      <div className="container px-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-bold mb-2">Về chúng tôi</h3>
            <p className="text-sm opacity-90">
              Hệ thống đọc truyện tranh online lớn nhất Việt Nam
            </p>
          </div>

          <div className="w-full md:w-auto">
            <h3 className="text-lg font-bold mb-2">Hỗ trợ</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="hover:opacity-80">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-sm">
          © {new Date().getFullYear()} TruyenHay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
