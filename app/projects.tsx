import type { PlanId } from "../lib/offers";

export const projects = [
  {
    id: "moc", name: "Mộc Studio", type: "Landing page", plan: "landing",
    brand: "mộc.", previewTitle: "Đẹp từ những điều giản dị.",
    art: "/moc.svg", previewLabel: "STUDIO THIẾT KẾ NỘI THẤT", button: "Xem bộ sưu tập",
    description: "Một trang giới thiệu studio nội thất, đưa khách từ bộ sưu tập nổi bật đến yêu cầu tư vấn.",
    highlights: ["Ảnh công trình mở đầu câu chuyện", "Một nút liên hệ dễ thấy trên điện thoại", "Biểu mẫu hỏi về không gian cần thiết kế"],
  },
  {
    id: "bep", name: "Bếp Nâu", type: "Website bán hàng", plan: "shop",
    brand: "Bếp Nâu", previewTitle: "Bánh thơm, vừa ra lò.",
    art: "/bep-nau.svg", previewLabel: "TIỆM BÁNH THỦ CÔNG", button: "Khám phá menu",
    description: "Một cửa hàng bánh thủ công với danh mục rõ ràng và luồng đặt hàng dành cho khách mua bằng điện thoại.",
    highlights: ["Danh mục theo dòng bánh", "Trang sản phẩm có quy cách và giá", "Giỏ hàng và bước gửi thông tin đặt bánh"],
  },
  {
    id: "nord", name: "Nord Workspace", type: "Website doanh nghiệp", plan: "business",
    brand: "nord/", previewTitle: "Làm việc theo nhịp của bạn.",
    art: "/nord.svg", previewLabel: "KHÔNG GIAN LÀM VIỆC CHUNG", button: "Khám phá không gian",
    description: "Website giới thiệu không gian làm việc chung, giúp khách chọn loại chỗ ngồi và đặt lịch tham quan.",
    highlights: ["Trang mô tả từng loại không gian", "Thông tin gói thuê trình bày dễ so sánh", "Luồng đặt lịch tham quan ngắn gọn"],
  },
] as const satisfies readonly {
  id: string; name: string; type: string; plan: PlanId; brand: string; previewTitle: string;
  art: string; previewLabel: string; button: string; description: string; highlights: readonly string[];
}[];

export type Project = typeof projects[number];

export function BrowserMockup({ project }: { project: Project }) {
  return (
    <div className={`mock-browser theme-${project.id}`} aria-hidden="true">
      <div className="mock-toolbar"><i /><i /><i /><span /></div>
      <div className="mock-nav"><strong>{project.brand}</strong><div><i /><i /><i /></div></div>
      <div className="mock-content">
        <div className="mock-copy">
          <small>{project.previewLabel}</small>
          <b>{project.previewTitle}</b>
          <span>{project.button} ↗</span>
        </div>
        <img src={project.art} alt="" width="360" height="280" />
      </div>
    </div>
  );
}
