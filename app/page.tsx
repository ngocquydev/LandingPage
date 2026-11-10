"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Calculator, Check, CircleCheck, CodeXml, Compass,
  LayoutGrid, Mail, Menu, MonitorSmartphone, PanelTop, Phone, Send, ShoppingBag,
  Sparkles, X,
} from "lucide-react";
import { contact, estimateFor, extras, formatPrice, isContact, plans } from "../lib/offers";
import type { ExtraId, PlanId } from "../lib/offers";
import { BrowserMockup, projects } from "./projects";
import type { Project } from "./projects";

const links = [
  ["#dich-vu", "Dịch vụ"],
  ["#du-an", "Dự án mẫu"],
  ["#quy-trinh", "Quy trình"],
  ["#goi-dich-vu", "Gói dịch vụ"],
] as const;

const serviceIcons = { panel: PanelTop, layout: LayoutGrid, bag: ShoppingBag };

const services = [
  { ...plans[0], copy: "Tập trung vào một sản phẩm hoặc chiến dịch với thông điệp rõ ràng và lời kêu gọi hành động dễ thấy." },
  { ...plans[1], copy: "Giúp khách hiểu bạn làm gì, xem năng lực và tìm thông tin liên hệ ngay khi cần." },
  { ...plans[2], copy: "Sắp xếp sản phẩm theo danh mục, hỗ trợ khách chọn hàng và gửi đơn trực tiếp trên web." },
];

const steps = [
  { title: "Trao đổi nhu cầu", text: "Xác định khách hàng, mục tiêu, nội dung sẵn có và phạm vi cần làm.", icon: Compass },
  { title: "Duyệt giao diện", text: "Xem bản thiết kế chính và góp ý trước khi bước vào lập trình.", icon: PanelTop },
  { title: "Xây dựng & kiểm tra", text: "Lập trình các trang, thử luồng sử dụng và kiểm tra trên điện thoại.", icon: CodeXml },
  { title: "Bàn giao website", text: "Hướng dẫn cập nhật nội dung và thống nhất cách hỗ trợ sau bàn giao.", icon: CircleCheck },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#trang-chu" className="brand" aria-label="NextWeb, về đầu trang">
      <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M4 24 13 8h5L9 24zm9 0 9-16h5l-9 16z" /></svg></span>
      <span>NextWeb{footer ? null : <i>.</i>}</span>
    </a>
  );
}

function SectionTag({ number, children }: { number: string; children: string }) {
  return <div className="section-tag"><span>{number}</span>{children}</div>;
}

function HeroArt() {
  const project = projects[0];
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-art-top"><span><i /> XEM TRƯỚC GIAO DIỆN</span><span>01 / 03</span></div>
      <div className="hero-orbit" />
      <span className="hero-star hero-star-one">✦</span><span className="hero-star hero-star-two">✦</span>
      <div className="hero-browser"><BrowserMockup project={project} /></div>
      <div className="hero-phone">
        <div className="phone-notch" />
        <div className="phone-page">
          <div className="phone-nav"><b>mộc.</b><Menu size={10} /></div>
          <img src="/moc.svg" alt="" width="360" height="280" />
          <small>STUDIO THIẾT KẾ</small>
          <strong>Đẹp từ những điều giản dị.</strong>
          <span>Xem bộ sưu tập ↗</span>
        </div>
      </div>
      <span className="art-device"><MonitorSmartphone size={17} /> Giao diện thích ứng</span>
      <span className="art-coordinates">DESKTOP / MOBILE</span>
    </div>
  );
}

type FormStatus = { kind: "idle" | "sending" | "success" | "error"; text: string };

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [estimatePlan, setEstimatePlan] = useState<PlanId>("landing");
  const [estimateExtras, setEstimateExtras] = useState<ExtraId[]>([]);
  const [formPlan, setFormPlan] = useState<PlanId | "">("");
  const [formExtras, setFormExtras] = useState<ExtraId[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const contactInput = useRef<HTMLInputElement>(null);
  const lastSubmission = useRef<{ body: string; id: string } | null>(null);
  const [status, setStatus] = useState<FormStatus>({ kind: "idle", text: "" });
  const estimate = estimateFor(estimatePlan, estimateExtras);

  useEffect(() => {
    if (project && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [project]);

  function closeMenuOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  }

  function selectForForm(plan: PlanId, options: ExtraId[] = []) {
    setFormPlan(plan);
    setFormExtras(options);
  }

  async function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const callback = String(values.get("contact") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    if (!isContact(callback)) {
      setStatus({ kind: "error", text: "Nhập số điện thoại hoặc địa chỉ email hợp lệ." });
      contactInput.current?.focus();
      return;
    }
    if (name.length < 2 || message.length < 10) {
      setStatus({ kind: "error", text: "Nhập họ tên và mô tả nhu cầu ít nhất 10 ký tự." });
      return;
    }

    const payload = {
      name, contact: callback, message, plan: formPlan || null, extras: formExtras, consent: values.get("consent") === "on",
    };
    const body = JSON.stringify(payload);
    if (lastSubmission.current?.body !== body) lastSubmission.current = { body, id: crypto.randomUUID() };
    const { id } = lastSubmission.current;
    setStatus({ kind: "sending", text: "Đang gửi yêu cầu…" });
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      const result = await response.json();
      if (!response.ok || !result || typeof result !== "object" || !("id" in result) || result.id !== id) {
        const error = result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : null;
        setStatus({ kind: "error", text: error ?? "Chưa thể gửi yêu cầu. Vui lòng thử lại." });
        return;
      }
      lastSubmission.current = null;
      form.reset();
      setFormPlan("");
      setFormExtras([]);
      setStatus({ kind: "success", text: `NextWeb đã nhận yêu cầu. Mã tham chiếu ${id.slice(0, 8).toUpperCase()}.` });
    } catch {
      setStatus({ kind: "error", text: "Chưa thể xác nhận yêu cầu đã gửi. Bạn có thể thử lại." });
    }
  }

  return (
    <>
      <a className="skip-link" href="#noi-dung">Chuyển tới nội dung</a>
      <header className="topbar" id="trang-chu" onKeyDown={closeMenuOnEscape}>
        <div className="wrap header-inner">
          <Brand />
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} id="menu-chinh" aria-label="Điều hướng chính">
            {links.map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a className="mobile-contact" href="#lien-he" onClick={() => setMenuOpen(false)}>Nhận tư vấn <ArrowUpRight size={16} /></a>
          </nav>
          <a className="button header-cta" href="#lien-he">Nhận tư vấn <ArrowUpRight size={17} /></a>
          <button ref={menuButton} type="button" className="menu-toggle" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-controls="menu-chinh" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main id="noi-dung">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-kicker"><span /> THIẾT KẾ WEBSITE THEO NHU CẦU</div>
            <h1 id="hero-title">Website đẹp.<br /> <em>Dễ dùng.</em><br /> Dễ liên hệ.</h1>
            <p>NextWeb thiết kế và lập trình website để khách hàng hiểu dịch vụ, tìm đúng thông tin và liên hệ với bạn dễ dàng, kể cả trên điện thoại.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#lien-he">Nhận tư vấn <ArrowUpRight size={19} /></a>
              <a className="button button-line" href="#du-an">Xem dự án mẫu <ArrowDown size={17} /></a>
            </div>
          </div>
          <HeroArt />
        </section>

        <div className="wrap">
          <ul className="benefits" aria-label="Điểm nổi bật">
            <li><MonitorSmartphone size={21} /> Ưu tiên di động</li>
            <li><Sparkles size={21} /> Thiết kế theo thương hiệu</li>
            <li><CircleCheck size={21} /> Bàn giao có hướng dẫn</li>
          </ul>
        </div>

        <section className="section wrap" id="dich-vu" aria-labelledby="services-title">
          <SectionTag number="01">DỊCH VỤ</SectionTag>
          <div className="section-heading">
            <h2 id="services-title">Bạn cần loại website nào?</h2>
            <p>Chọn theo mục tiêu hiện tại của bạn, từ giới thiệu một dịch vụ đến bán hàng trực tuyến.</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon];
              return (
                <article className="service-card" key={service.id}>
                  <div className="service-top"><span className="service-icon"><Icon size={24} /></span><span>0{index + 1} / 03</span></div>
                  <h3>{service.name}</h3>
                  <p>{service.copy}</p>
                  <a href="#goi-dich-vu" onClick={() => setEstimatePlan(service.id)} aria-label={`Xem gói ${service.name}`}>Xem gói phù hợp <ArrowRight size={18} /></a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section portfolio-section" id="du-an" aria-labelledby="portfolio-title">
          <div className="wrap">
            <SectionTag number="02">PORTFOLIO</SectionTag>
            <div className="section-heading">
              <h2 id="portfolio-title">Xem cách mỗi website hoạt động.</h2>
              <p>Ba mẫu thiết kế minh họa cho ba nhu cầu. Mở từng mẫu để xem các tính năng được đề xuất.</p>
            </div>
            <div className="portfolio-grid">
              {projects.map((item) => (
                <button className="project-card" type="button" key={item.id} onClick={() => setProject(item)} aria-label={`Xem dự án mẫu ${item.name}`}>
                  <div className={`project-art project-${item.id}`}><BrowserMockup project={item} /><span className="demo-badge">MẪU MINH HỌA</span></div>
                  <div className="project-info">
                    <span><span className="project-type">{item.type}</span><strong>{item.name}</strong></span>
                    <span className="round-link" aria-hidden="true"><ArrowUpRight size={20} /></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap" id="quy-trinh" aria-labelledby="process-title">
          <SectionTag number="03">QUY TRÌNH</SectionTag>
          <div className="section-heading">
            <h2 id="process-title">Từ ý tưởng đến bàn giao.</h2>
            <p>Bốn bước để bạn biết khi nào cần góp ý và sẽ nhận được gì.</p>
          </div>
          <ol className="process-grid">
            {steps.map(({ title, text, icon: Icon }, index) => (
              <li key={title}>
                <div className="step-top"><span>0{index + 1}</span><Icon size={22} /></div>
                <h3>{title}</h3><p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section pricing-section" id="goi-dich-vu" aria-labelledby="pricing-title">
          <div className="wrap">
            <SectionTag number="04">GÓI DỊCH VỤ</SectionTag>
            <div className="section-heading">
              <h2 id="pricing-title">Ước tính cho website của bạn.</h2>
              <p>Chọn một gói và tính năng bổ sung để xem mức đầu tư tham khảo trước khi trao đổi.</p>
            </div>
            <fieldset className="plan-group">
              <legend className="visually-hidden">Chọn gói dịch vụ</legend>
              <div className="plans-grid">
                {plans.map((plan) => (
                  <label className={plan.id === estimatePlan ? "plan-card plan-active" : "plan-card"} key={plan.id}>
                    <div className="plan-top"><strong>{plan.name}</strong><input type="radio" name="estimate-plan" value={plan.id} checked={estimatePlan === plan.id} onChange={() => setEstimatePlan(plan.id)} aria-label={plan.name} /></div>
                    <div className="plan-price"><span>Từ</span> {formatPrice(plan.price)}</div>
                    <p>{plan.for}</p>
                    <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="estimate-grid">
              <fieldset className="extras">
                <legend className="visually-hidden">Tùy chọn bổ sung</legend>
                <h3>Tùy chọn bổ sung</h3>
                {extras.map((extra) => (
                  <label key={extra.id} className="extra-option">
                    <span><input type="checkbox" checked={estimateExtras.includes(extra.id)} onChange={(event) => {
                      const checked = event.target.checked;
                      setEstimateExtras((current) => checked ? [...current, extra.id] : current.filter((id) => id !== extra.id));
                    }} />{extra.name}</span>
                    <span>+{formatPrice(extra.price)}</span>
                  </label>
                ))}
              </fieldset>
              <div className="estimate-summary">
                <div className="estimate-total"><span><Calculator size={18} /> TẠM TÍNH</span><output aria-live="polite">{formatPrice(estimate)}</output></div>
                <p>Giá tham khảo. Phạm vi, tên miền và hosting sẽ được trao đổi khi tư vấn.</p>
                <a className="button button-mint" href="#lien-he" onClick={() => selectForForm(estimatePlan, estimateExtras)}>Dùng dự toán này <ArrowRight size={18} /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap contact-section" id="lien-he" aria-labelledby="contact-title">
          <div className="contact-panel">
            <div className="contact-intro">
              <SectionTag number="05">LIÊN HỆ</SectionTag>
              <h2 id="contact-title">Kể mình nghe về dự án của bạn.</h2>
              <p>Chia sẻ mục tiêu và những gì bạn đang có. NextWeb sẽ liên hệ để trao đổi về hướng triển khai và chi phí dự kiến.</p>
              <div className="contact-links">
                <a href={`tel:${contact.tel}`}><span><Phone size={19} /></span><span><small>ĐIỆN THOẠI</small><b>{contact.phone}</b></span><ArrowUpRight size={18} /></a>
                <div><span><Mail size={19} /></span><span><small>EMAIL</small><b>{contact.email}</b></span></div>
              </div>
            </div>
            <form className="contact-form" method="post" action="/api/consultation" onSubmit={submitConsultation}>
              <h3>Gửi yêu cầu tư vấn</h3>
              <p>Thông tin có dấu * là bắt buộc.</p>
              <fieldset disabled={status.kind === "sending"} className="form-fields">
                <legend className="visually-hidden">Thông tin tư vấn</legend>
                <div className="form-pair">
                  <label>Họ và tên *<input name="name" placeholder="Nguyễn Văn A" autoComplete="name" required minLength={2} maxLength={80} /></label>
                  <label>Số điện thoại hoặc email *<input ref={contactInput} name="contact" placeholder="Số điện thoại hoặc email" required maxLength={120} /></label>
                </div>
                <label>Loại website
                  <select name="plan" value={formPlan} onChange={(event) => {
                    setFormPlan(event.target.value as PlanId | "");
                    setFormExtras([]);
                  }}>
                    <option value="">Chưa xác định</option>
                    {plans.map((plan) => <option value={plan.id} key={plan.id}>{plan.name}</option>)}
                  </select>
                </label>
                {formPlan && <div className="form-estimate" aria-live="polite">
                  <strong>Dự toán {formatPrice(estimateFor(formPlan, formExtras))}</strong>
                  {formExtras.length > 0 && <span>{extras.filter(({ id }) => formExtras.includes(id)).map(({ name }) => name).join(" · ")}</span>}
                </div>}
                <label>Nhu cầu của bạn *<textarea name="message" placeholder="Ví dụ, mình cần website giới thiệu dịch vụ và nhận lịch hẹn…" required minLength={10} maxLength={1200} rows={4} /></label>
                <label className="consent"><input type="checkbox" name="consent" required /><span>Tôi đồng ý lưu thông tin trên trang NextWeb để được liên hệ về yêu cầu này.</span></label>
                <button className="button button-dark send-button" type="submit">{status.kind === "sending" ? "Đang gửi…" : "Gửi yêu cầu tư vấn"} <Send size={17} /></button>
              </fieldset>
              <div className={`form-status status-${status.kind}`} role="status" aria-live="polite">
                {status.kind === "success" && <CircleCheck size={19} />}{status.text}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <Brand footer />
        <p>Thiết kế website theo nhu cầu.</p>
        <a href="#trang-chu" className="back-top">Về đầu trang <ArrowUpRight size={16} /></a>
      </footer>

      <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onClose={() => setProject(null)} onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}>
        {project && <div className="dialog-body">
          <div className={`project-art project-${project.id}`}>
            <BrowserMockup project={project} /><span className="demo-badge">MẪU MINH HỌA</span>
            <button className="dialog-close" type="button" aria-label="Đóng dự án mẫu" autoFocus onClick={() => dialog.current?.close()}><X size={21} /></button>
          </div>
          <div className="dialog-copy">
            <div className="project-type">{project.type}</div>
            <h2 id="project-title">{project.name}</h2>
            <p>{project.description}</p>
            <ul>{project.highlights.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
            <a href="#lien-he" className="button button-dark" onClick={() => {
              selectForForm(project.plan);
              dialog.current?.close();
            }}>Tư vấn website tương tự <ArrowUpRight size={18} /></a>
          </div>
        </div>}
      </dialog>
    </>
  );
}
