import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiHome,
  FiImage,
  FiMapPin,
  FiMenu,
  FiShield,
  FiSliders,
  FiUpload,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";

const assets = {
  hero: "/assets/casa-brasileira-hero.webp",
  before: "/assets/casa-before.webp",
  after: "/assets/casa-after.webp",
  wood: "/assets/gate-wood.webp",
  woodSolid: "/assets/gate-wood-solid.webp",
  metal: "/assets/gate-metal.webp",
  aluminum: "/assets/gate-aluminum.webp",
  iron: "/assets/gate-iron.webp",
  glass: "/assets/gate-glass.webp",
  basculante: "/assets/gate-basculante.webp",
  sliding: "/assets/gate-sliding.webp",
  storyCampinas: "/assets/story-campinas.webp",
  storyBh: "/assets/story-bh.webp",
  installer: "/assets/installer-partner.webp",
};

const styles = [
  ["Moderno", assets.metal, "50%"],
  ["Ripado", assets.wood, "50%"],
  ["Alumínio", assets.aluminum, "50%"],
  ["Madeira", assets.woodSolid, "50%"],
  ["Ferro", assets.iron, "50%"],
  ["Vidro", assets.glass, "50%"],
  ["Basculante", assets.basculante, "50%"],
  ["Deslizante", assets.sliding, "50%"],
];

const simulationStyles = [
  "Moderno",
  "Clássico",
  "Ripado",
  "Industrial",
  "Alto padrão",
  "Mais privacidade",
  "Mais ventilação",
  "Econômico",
];

const results = [
  {
    name: "Moderno fechado",
    description: "Linhas retas, alta privacidade e acabamento preto fosco.",
    image: assets.metal,
    position: "50%",
  },
  {
    name: "Ripado elegante",
    description: "Madeira quente com iluminação integrada e entrada social.",
    image: assets.wood,
    position: "50%",
  },
  {
    name: "Madeira natural",
    description: "Tábuas verticais, fachada clara e sensação acolhedora.",
    image: assets.woodSolid,
    position: "50%",
  },
  {
    name: "Alumínio preto",
    description: "Leve, resistente e com recortes que favorecem a ventilação.",
    image: assets.aluminum,
    position: "50%",
  },
  {
    name: "Deslizante minimalista",
    description: "Visual contínuo e abertura prática para garagens compactas.",
    image: assets.sliding,
    position: "50%",
  },
];

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function LinkButton({ to, children, className = "", secondary = false }) {
  return (
    <a
      href={to}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a
        href="/"
        className="logo"
        onClick={(event) => {
          event.preventDefault();
          navigate("/");
        }}
      >
        <FiHome aria-hidden="true" /> Meu Portão <span>IA</span>
      </a>
      <nav className={open ? "nav open" : "nav"} aria-label="Navegação principal">
        <LinkButton to="/simular">Simular agora</LinkButton>
        <a
          href="/empresas"
          className="nav-link"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            navigate("/empresas");
          }}
        >
          Para empresas
        </a>
      </nav>
      <button
        className="menu-button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <FiX /> : <FiMenu />}
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo footer-logo">
            <FiHome aria-hidden="true" /> Meu Portão <span>IA</span>
          </div>
          <p>
            Visualize ideias de portões na sua própria fachada antes de chamar
            uma empresa. Um MVP para decidir com mais clareza.
          </p>
          <LinkButton to="/simular" className="footer-cta">Simular grátis <FiArrowRight /></LinkButton>
        </div>
        <div className="footer-column">
          <h3>Para moradores</h3>
          <a href="/simular" onClick={(e) => { e.preventDefault(); navigate("/simular"); }}>Simular minha fachada</a>
          <a href="/#estilos" onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => document.getElementById("estilos")?.scrollIntoView({ behavior: "smooth" }), 0); }}>Ver estilos</a>
          <a href="/privacidade" onClick={(e) => { e.preventDefault(); navigate("/privacidade"); }}>Como usamos seus dados</a>
        </div>
        <div className="footer-column">
          <h3>Para empresas</h3>
          <a href="/empresas" onClick={(e) => { e.preventDefault(); navigate("/empresas"); }}>Receber leads</a>
          <a href="/empresas#cadastro" onClick={(e) => { e.preventDefault(); navigate("/empresas"); setTimeout(() => document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" }), 0); }}>Virar parceiro</a>
          <a href="/privacidade" onClick={(e) => { e.preventDefault(); navigate("/privacidade"); }}>Política do MVP</a>
        </div>
        <div className="footer-card">
          <FiShield />
          <h3>Privacidade simples</h3>
          <p>Fotos e dados só avançam para parceiros quando o usuário aceita receber contato.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Meu Portão IA</span>
        <span>MVP demonstrativo sem pagamentos, login ou backend real.</span>
      </div>
    </footer>
  );
}

function BeforeAfter({ compact = false }) {
  const [position, setPosition] = useState(50);
  const boxRef = useRef(null);

  const updatePosition = (clientX) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(Math.max(5, Math.min(95, ((clientX - box.left) / box.width) * 100)));
  };

  return (
    <div
      className={`before-after ${compact ? "compact" : ""}`}
      ref={boxRef}
      onPointerMove={(event) => {
        if (event.buttons === 1) updatePosition(event.clientX);
      }}
    >
      <img src={assets.before} alt="Fachada antes de trocar o portão" />
      <div className="after-mask" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <img src={assets.after} alt="Fachada depois de trocar o portão" />
      </div>
      <span className="image-label before-label">Antes</span>
      <span className="image-label after-label">Depois</span>
      <input
        aria-label="Comparar fachada antes e depois"
        type="range"
        min="5"
        max="95"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
      <span className="slider-handle" style={{ left: `${position}%` }}>
        <FiChevronLeft />
        <FiChevronRight />
      </span>
    </div>
  );
}

function HomePage() {
  const [styleFilter, setStyleFilter] = useState("Todos");
  const filteredStyles = styleFilter === "Todos"
    ? styles
    : styles.filter(([name]) => name === styleFilter);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Visualize antes de reformar</p>
            <h1>Veja como sua casa ficaria com um novo portão antes de gastar dinheiro</h1>
            <p className="hero-description">
              Use a inteligência artificial para visualizar diferentes modelos
              na fachada da sua casa e conecte-se com instaladores de confiança.
            </p>
            <LinkButton to="/simular" className="hero-button">
              Simular meu portão <FiArrowRight />
            </LinkButton>
            <div className="hero-benefits">
              <span><FiClock /> Rápido e fácil</span>
              <span><FiImage /> Resultado realista</span>
              <span><FiShield /> Profissionais verificados</span>
              <span><FiCheck /> Sem compromisso</span>
            </div>
            <div className="hero-proof">
              <strong>4 passos</strong>
              <span>foto, estilo, ideias e orçamento</span>
              <strong>0 custo</strong>
              <span>para testar o MVP</span>
            </div>
          </div>
          <BeforeAfter />
        </section>

        <section className="how-section">
          <div className="shell">
            <div className="center-heading">
              <h2>Do seu jeito, em 3 passos simples</h2>
            </div>
            <div className="how-grid">
            {[
              [<FiUpload />, "1.", "Envie a foto da fachada", "Use uma foto frontal e bem iluminada da sua casa."],
              [<FiGrid />, "2.", "Escolha o estilo do portão", "Compare materiais, aberturas, cores e níveis de privacidade."],
              [<FiImage />, "3.", "Receba ideias e orçamento", "Escolha sua favorita e fale com empresas da sua região."],
            ].map(([icon, number, title, text]) => (
              <article className="step" key={number}>
                <div className="step-icon">{icon}</div>
                <div>
                  <span className="step-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
            </div>
          </div>
        </section>

        <section className="shell section" id="estilos">
          <div className="section-heading">
            <div>
              <h2>Inspiração para todos os estilos</h2>
              <p>Explore por material ou tipo de abertura e encontre o portão ideal para sua casa.</p>
            </div>
          </div>
          <div className="style-filters" aria-label="Filtros de estilo">
            {["Todos", "Moderno", "Ripado", "Alumínio", "Madeira", "Ferro", "Vidro", "Basculante", "Deslizante"].map((filter) => (
              <button
                className={styleFilter === filter ? "active" : ""}
                key={filter}
                onClick={() => setStyleFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className={filteredStyles.length === 1 ? "style-grid filtered" : "style-grid"}>
            {filteredStyles.map(([name, image, position]) => (
              <button
                className="style-card"
                key={name}
                onClick={() => navigate("/simular")}
              >
                <img src={image} alt={`Portão estilo ${name}`} style={{ objectPosition: position }} />
                <span>{name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="transformations">
          <div className="shell">
            <div className="center-heading">
              <h2>Histórias reais de quem já transformou</h2>
            </div>
            <div className="story-grid">
              <article className="story-card">
                <img className="story-image" src={assets.storyCampinas} alt="Antes e depois de fachada em Campinas" />
                <div className="story-copy">
                  <span><FiMapPin /> Campinas, SP</span>
                  <h3>“Deu outra cara para a minha casa”</h3>
                  <p>Em menos de 5 minutos eu vi como ficaria. Escolhi o modelo ripado preto e recebi 3 orçamentos no mesmo dia.</p>
                  <strong>— Marcelo S.</strong>
                </div>
              </article>
              <article className="story-card">
                <img className="story-image" src={assets.storyBh} alt="Antes e depois de fachada em Belo Horizonte" />
                <div className="story-copy">
                  <span><FiMapPin /> Belo Horizonte, MG</span>
                  <h3>“Escolhi com confiança e economizei”</h3>
                  <p>Consegui comparar modelos, preços e avaliações de instaladores perto de mim. Foi simples e seguro.</p>
                  <strong>— Juliana A.</strong>
                </div>
              </article>
            </div>
            <LinkButton to="/simular" secondary className="stories-button">Criar minha história <FiArrowRight /></LinkButton>
          </div>
        </section>

        <section className="shell partner-section">
          <div className="partner-copy">
            <p className="eyebrow">Para empresas</p>
            <h2>Mais clientes qualificados para o seu negócio</h2>
            <p>
              Receba clientes que já visualizaram o portão desejado e chegam
              prontos para conversar sobre materiais, medidas e orçamento.
            </p>
            <ul className="check-list">
              <li><FiCheck /> Foto real da fachada</li>
              <li><FiCheck /> Preferência visual definida</li>
              <li><FiCheck /> Cidade, bairro e urgência</li>
            </ul>
            <LinkButton to="/empresas">Quero levar mais clientes <FiArrowRight /></LinkButton>
          </div>
          <div className="partner-visual">
            <img src={assets.installer} alt="Instalador parceiro analisando projetos de portões" />
          </div>
        </section>

        <section className="trust-strip">
          <div className="shell trust-strip-grid">
            <span><FiUsers /><strong>Instaladores verificados</strong><small>Profissionais avaliados pela comunidade</small></span>
            <span><FiShield /><strong>Privacidade garantida</strong><small>Suas informações protegidas</small></span>
            <span><FiCheck /><strong>Sem compromisso</strong><small>Você escolhe com liberdade</small></span>
            <span><FiHome /><strong>Atendimento humano</strong><small>Estamos aqui para ajudar</small></span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function LeadModal({ model, onClose }) {
  const [success, setSuccess] = useState(false);

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    // Future integration point: send qualified lead to CRM, database or WhatsApp.
    console.log("Lead Meu Portão IA", { ...data, selectedModel: model.name });
    setSuccess(true);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="lead-title">
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><FiX /></button>
        {success ? (
          <div className="success-state">
            <span className="success-icon"><FiCheck /></span>
            <p className="eyebrow">Interesse recebido</p>
            <h2>Pronto!</h2>
            <p>Em breve uma empresa parceira poderá entrar em contato com ideias e orçamento.</p>
            <button className="button" onClick={onClose}>Voltar aos modelos</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Modelo escolhido</p>
            <h2 id="lead-title">Receba orçamento para o {model.name}</h2>
            <form className="form-grid" onSubmit={submit}>
              <label>Nome<input name="name" required placeholder="Seu nome" /></label>
              <label>WhatsApp<input name="whatsapp" required type="tel" placeholder="(11) 99999-9999" /></label>
              <label>Cidade<input name="city" required placeholder="Sua cidade" /></label>
              <label>Bairro<input name="neighborhood" required placeholder="Seu bairro" /></label>
              <label className="full">Quando pretende trocar?
                <select name="timing" required defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Agora</option><option>Em até 30 dias</option>
                  <option>Em até 3 meses</option><option>Só estou pesquisando</option>
                </select>
              </label>
              <label className="full">Tipo de imóvel
                <select name="property" required defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Casa de rua</option><option>Condomínio</option>
                  <option>Prédio</option><option>Comércio</option>
                </select>
              </label>
              <label className="checkbox full">
                <input type="checkbox" name="consent" required />
                <span>Aceito receber contato de empresas parceiras para orçamento.</span>
              </label>
              <button className="button full" type="submit">Receber orçamento <FiArrowRight /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function SimulatorPage() {
  const [image, setImage] = useState(null);
  const [selected, setSelected] = useState(["Moderno"]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [leadModel, setLeadModel] = useState(null);

  const toggleStyle = (style) => {
    setSelected((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  };

  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Future integration point: upload the original facade photo to cloud storage.
    setImage(URL.createObjectURL(file));
    setGenerated(false);
  };

  const generate = () => {
    if (!image) return;
    setLoading(true);
    setGenerated(false);
    // Future integration point: call the image generation API with photo, styles and description.
    window.setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  };

  return (
    <>
      <Header />
      <main className="simulator-page">
        <section className="simulator-intro shell">
          <p className="eyebrow">Simulador Meu Portão IA</p>
          <h1>Comece com uma foto da sua fachada.</h1>
          <p>Em poucos passos, você terá referências mais claras para conversar com um profissional.</p>
        </section>
        <section className="shell simulator-layout">
          <div className="upload-column">
            <div className="upload-box">
              {image ? (
                <>
                  <img src={image} alt="Prévia da fachada enviada" />
                  <label className="replace-photo">
                    <FiUpload /> Trocar foto
                    <input type="file" accept="image/*" onChange={upload} />
                  </label>
                </>
              ) : (
                <label className="upload-empty">
                  <span className="upload-icon"><FiUpload /></span>
                  <strong>Envie a foto da fachada</strong>
                  <span>JPG ou PNG, até 10 MB</span>
                  <span className="button">Escolher foto</span>
                  <input type="file" accept="image/*" onChange={upload} />
                </label>
              )}
            </div>
            <div className="photo-tip"><FiShield /><span><strong>Sua foto fica protegida.</strong> Neste MVP, ela é usada apenas no seu navegador.</span></div>
          </div>
          <div className="preferences">
            <div className="form-section-title"><span>01</span><div><h2>Escolha o estilo</h2><p>Você pode combinar mais de uma preferência.</p></div></div>
            <div className="selector-grid">
              {simulationStyles.map((style) => (
                <button
                  className={selected.includes(style) ? "selector active" : "selector"}
                  key={style}
                  onClick={() => toggleStyle(style)}
                >
                  <span>{selected.includes(style) && <FiCheck />}</span>{style}
                </button>
              ))}
            </div>
            <div className="form-section-title second"><span>02</span><div><h2>Conte os detalhes</h2><p>Opcional, mas ajuda a aproximar a ideia do que você imagina.</p></div></div>
            <label className="textarea-label">
              Descreva o que você quer
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex.: Quero um portão preto, moderno, fechado, com entrada social lateral."
              />
            </label>
            <button className="button generate-button" disabled={!image || loading} onClick={generate}>
              {loading ? <><span className="spinner" /> Criando suas ideias...</> : <><FiZap /> Gerar ideias</>}
            </button>
            {!image && <small className="disabled-note">Envie uma foto para liberar a geração.</small>}
          </div>
        </section>

        {(loading || generated) && (
          <section className="results-section" id="results">
            <div className="shell">
              <div className="section-heading">
                <div><p className="eyebrow">Sua seleção</p><h2>{loading ? "A IA está redesenhando sua fachada" : "Quatro ideias para comparar"}</h2></div>
              </div>
              {loading ? (
                <div className="loading-panel">
                  <div className="scan-line" />
                  <img src={image} alt="" />
                  <p>Analisando proporções, abertura e estilo da fachada...</p>
                </div>
              ) : (
                <div className="result-grid">
                  {results.map((result, index) => (
                    <article className="result-card" key={result.name}>
                      <div className="result-image">
                        <img src={result.image} alt={result.name} style={{ objectPosition: result.position }} />
                        <span>Modelo {index + 1}</span>
                      </div>
                      <div className="result-content">
                        <h3>{result.name}</h3>
                        <p>{result.description}</p>
                        <button className="button button-secondary" onClick={() => setLeadModel(result)}>Gostei desse <FiArrowRight /></button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
      {leadModel && <LeadModal model={leadModel} onClose={() => setLeadModel(null)} />}
    </>
  );
}

function PartnerForm() {
  const [sent, setSent] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    // Future integration point: persist partner interest and notify the sales team.
    console.log("Interesse de parceiro", Object.fromEntries(new FormData(event.currentTarget)));
    setSent(true);
  };
  if (sent) return <div className="partner-success"><FiCheck /><h3>Cadastro recebido.</h3><p>Nossa equipe entrará em contato para conhecer sua região de atuação.</p></div>;
  return (
    <form className="partner-form" onSubmit={submit}>
      <label>Nome da empresa<input required name="company" placeholder="Nome da sua empresa" /></label>
      <label>Responsável<input required name="owner" placeholder="Seu nome" /></label>
      <label>WhatsApp<input required name="whatsapp" type="tel" placeholder="(11) 99999-9999" /></label>
      <label>Cidade de atuação<input required name="city" placeholder="Cidade principal" /></label>
      <label className="full">Quantos portões instala por mês?
        <select required name="volume" defaultValue="">
          <option value="" disabled>Selecione uma faixa</option>
          <option>Até 5</option><option>De 6 a 15</option><option>De 16 a 30</option><option>Mais de 30</option>
        </select>
      </label>
      <button className="button full">Quero ser parceiro <FiArrowRight /></button>
    </form>
  );
}

function CompaniesPage() {
  const plans = [
    ["Inicial", "R$ 99", "Até 20 leads", ["Área de atuação local", "Preferências do cliente", "Suporte por e-mail"]],
    ["Profissional", "R$ 199", "Até 60 leads", ["Mais cidades de atuação", "Prioridade na distribuição", "Relatório de desempenho"]],
    ["Parceiro", "Sob consulta", "Leads ilimitados", ["Destaque regional", "Integração comercial", "Atendimento dedicado"]],
  ];
  return (
    <>
      <Header />
      <main>
        <section className="business-hero">
          <div className="shell business-grid">
            <div>
              <p className="eyebrow light">Meu Portão IA para empresas</p>
              <h1>Receba clientes que já sabem o modelo de portão que desejam</h1>
              <p>Transforme inspiração em oportunidades comerciais mais claras, com foto, localização e intenção de compra.</p>
              <a href="#cadastro" className="button button-light">Quero receber leads <FiArrowRight /></a>
            </div>
            <img src={assets.wood} alt="Fachada contemporânea com portão ripado" />
          </div>
        </section>
        <section className="shell business-benefits">
          <div className="section-heading"><div><p className="eyebrow">Leads com contexto</p><h2>Menos conversa fria. Mais chance de fechar.</h2></div></div>
          <div className="benefit-grid">
            {[
              [<FiImage />, "Foto real da fachada", "Veja o imóvel antes mesmo do primeiro contato."],
              [<FiSliders />, "Preferência definida", "Entenda material, estilo e abertura desejados."],
              [<FiMapPin />, "Região informada", "Receba oportunidades dentro da sua área."],
              [<FiClock />, "Urgência visível", "Priorize quem pretende comprar primeiro."],
            ].map(([icon, title, text]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>
        <section className="pricing-section">
          <div className="shell">
            <div className="section-heading"><div><p className="eyebrow">Planos transparentes</p><h2>Escolha o ritmo da sua operação</h2></div></div>
            <div className="pricing-grid">
              {plans.map(([name, price, lead, benefits], index) => (
                <article className={index === 1 ? "pricing-card featured" : "pricing-card"} key={name}>
                  {index === 1 && <span className="recommended">Mais escolhido</span>}
                  <p className="eyebrow">Plano {name}</p>
                  <h3>{price}{price.startsWith("R$") && <small>/mês</small>}</h3>
                  <strong>{lead}</strong>
                  <ul>{benefits.map((benefit) => <li key={benefit}><FiCheck />{benefit}</li>)}</ul>
                  <a href="#cadastro" className="button button-secondary">Escolher plano <FiArrowRight /></a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="shell partner-form-section" id="cadastro">
          <div>
            <p className="eyebrow">Seja parceiro</p>
            <h2>Conte um pouco sobre sua empresa.</h2>
            <p>Vamos entender sua área de atuação e indicar o plano mais adequado.</p>
          </div>
          <PartnerForm />
        </section>
      </main>
      <Footer />
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="privacy shell">
        <p className="eyebrow">Transparência desde o MVP</p>
        <h1>Política de privacidade</h1>
        <p className="privacy-lead">Última atualização: 15 de junho de 2026.</p>
        {[
          ["1. Imagens da fachada", "Você envia a imagem voluntariamente para criar simulações de portões. Neste MVP, o processamento é demonstrativo e acontece localmente no navegador."],
          ["2. Dados de contato", "Nome, WhatsApp, cidade e bairro são coletados apenas quando você solicita orçamento ou demonstra interesse em uma empresa parceira."],
          ["3. Compartilhamento", "Seus dados poderão ser compartilhados com empresas parceiras somente quando você marcar a autorização no formulário de orçamento."],
          ["4. Exclusão", "Você pode solicitar a exclusão dos dados enviados pelos canais de contato da plataforma. A versão futura terá um fluxo dedicado para esse pedido."],
          ["5. Natureza do projeto", "O Meu Portão IA apresentado aqui é um MVP demonstrativo. Não há pagamento, autenticação ou armazenamento permanente de imagens nesta versão."],
        ].map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
        <div className="privacy-note"><FiShield /><div><strong>Privacidade por escolha</strong><p>Nunca autorizamos o contato de parceiros sem seu consentimento explícito.</p></div></div>
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return <><Header /><main className="not-found shell"><p className="eyebrow">Erro 404</p><h1>Essa entrada não abriu.</h1><LinkButton to="/">Voltar para a Home</LinkButton></main><Footer /></>;
}

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const page = useMemo(() => {
    if (path === "/") return <HomePage />;
    if (path === "/simular") return <SimulatorPage />;
    if (path === "/empresas") return <CompaniesPage />;
    if (path === "/privacidade") return <PrivacyPage />;
    return <NotFound />;
  }, [path]);
  return page;
}
