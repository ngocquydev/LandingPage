export const plans = [
  {
    id: "landing",
    name: "Landing page",
    icon: "panel",
    price: 2500000,
    for: "Ra mắt một dịch vụ hoặc chạy một chiến dịch.",
    features: ["Một trang theo mục tiêu", "Biểu mẫu nhận khách tiềm năng", "Giao diện cho điện thoại và máy tính"],
  },
  {
    id: "business",
    name: "Website doanh nghiệp",
    icon: "layout",
    price: 5500000,
    for: "Giới thiệu thương hiệu, dịch vụ và năng lực.",
    features: ["Tối đa 5 trang nội dung", "Quản trị nội dung cơ bản", "Thiết lập SEO cơ bản"],
  },
  {
    id: "shop",
    name: "Website bán hàng",
    icon: "bag",
    price: 9500000,
    for: "Trưng bày sản phẩm và nhận đơn trực tuyến.",
    features: ["Danh mục và trang sản phẩm", "Giỏ hàng và gửi đơn hàng", "Quản trị sản phẩm và đơn hàng"],
  },
] as const;

export const extras = [
  { id: "language", name: "Thêm một ngôn ngữ", price: 1500000 },
  { id: "copy", name: "Biên tập nội dung", price: 1200000 },
  { id: "analytics", name: "Thiết lập đo lường", price: 700000 },
] as const;

export type PlanId = typeof plans[number]["id"];
export type ExtraId = typeof extras[number]["id"];

export function estimateFor(planId: PlanId, extraIds: readonly ExtraId[]) {
  const plan = plans.find(({ id }) => id === planId);
  return (plan?.price ?? 0) + extras.reduce((total, extra) => total + (extraIds.includes(extra.id) ? extra.price : 0), 0);
}

export const formatPrice = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

export const contact = {
  phone: "0346 500 853",
  tel: "0346500853",
  email: "ngocquy020704@gmail.com",
};

export function isContact(value: string) {
  const phone = value.replace(/[ ().-]/g, "");
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\+?\d{8,15}$/.test(phone);
}
