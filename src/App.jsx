import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
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
          className="nav-link nav-partner-link"
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
        <span>MVP com captação de leads via Convex, sem pagamentos ou login.</span>
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

function LeadModal({ model, onClose, backendEnabled, selectedStyles, description, photoAttached }) {
  if (backendEnabled) {
    return (
      <ConnectedLeadModal
        model={model}
        onClose={onClose}
        selectedStyles={selectedStyles}
        description={description}
        photoAttached={photoAttached}
      />
    );
  }

  return (
    <LeadModalContent
      model={model}
      onClose={onClose}
      selectedStyles={selectedStyles}
      description={description}
      photoAttached={photoAttached}
      backendEnabled={false}
    />
  );
}

function ConnectedLeadModal(props) {
  const createLead = useMutation(api.leads.createLead);
  return <LeadModalContent {...props} backendEnabled onSubmitLead={createLead} />;
}

function LeadModalContent({
  model,
  onClose,
  backendEnabled,
  onSubmitLead,
  selectedStyles = [],
  description = "",
  photoAttached = false,
}) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!backendEnabled || !onSubmitLead) {
      setError("A conexão com o banco ainda precisa ser ativada para receber este pedido.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const field = (name) => String(formData.get(name) || "").trim();

    try {
      setSubmitting(true);
      await onSubmitLead({
        name: field("name"),
        whatsapp: field("whatsapp"),
        city: field("city"),
        neighborhood: field("neighborhood"),
        timing: field("timing"),
        property: field("property"),
        consent: formData.get("consent") === "on",
        selectedModel: model.name,
        selectedStyles,
        description: description.trim() || undefined,
        source: "simulator",
        pagePath: window.location.pathname,
        photoAttached,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
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
              {error && <p className="form-error full">{error}</p>}
              <button className="button full" type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : <>Receber orçamento <FiArrowRight /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function SimulatorPage({ backendEnabled }) {
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
      {leadModel && (
        <LeadModal
          model={leadModel}
          onClose={() => setLeadModel(null)}
          backendEnabled={backendEnabled}
          selectedStyles={selected}
          description={description}
          photoAttached={Boolean(image)}
        />
      )}
    </>
  );
}

function PartnerForm({ backendEnabled }) {
  if (backendEnabled) {
    return <ConnectedPartnerForm />;
  }

  return <PartnerFormContent backendEnabled={false} />;
}

function ConnectedPartnerForm() {
  const createPartnerLead = useMutation(api.leads.createPartnerLead);
  return <PartnerFormContent backendEnabled onSubmitPartnerLead={createPartnerLead} />;
}

function PartnerFormContent({ backendEnabled, onSubmitPartnerLead }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!backendEnabled || !onSubmitPartnerLead) {
      setError("A conexão com o banco ainda precisa ser ativada para receber este cadastro.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const field = (name) => String(formData.get(name) || "").trim();

    try {
      setSubmitting(true);
      await onSubmitPartnerLead({
        company: field("company"),
        owner: field("owner"),
        whatsapp: field("whatsapp"),
        city: field("city"),
        serviceType: field("serviceType"),
        serviceRegion: field("serviceRegion"),
        source: "partner-page",
        pagePath: window.location.pathname,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) return <div className="partner-success"><FiCheck /><h3>Cadastro recebido.</h3><p>Nossa equipe entrará em contato para conhecer sua região de atuação.</p></div>;
  return (
    <form className="partner-form" onSubmit={submit}>
      <label>Nome da empresa<input required name="company" placeholder="Nome da sua empresa" /></label>
      <label>Responsável<input required name="owner" placeholder="Seu nome" /></label>
      <label>WhatsApp<input required name="whatsapp" type="tel" placeholder="(11) 99999-9999" /></label>
      <label>Cidade/Estado<input required name="city" placeholder="Ex.: Indaiatuba, SP" /></label>
      <label className="full">Tipo de serviço
        <select required name="serviceType" defaultValue="">
          <option value="" disabled>Selecione</option>
          <option>Fabricação</option>
          <option>Instalação</option>
          <option>Automação</option>
          <option>Manutenção</option>
          <option>Todos</option>
        </select>
      </label>
      <label className="full">Região atendida<input required name="serviceRegion" placeholder="Ex.: Indaiatuba, Salto, Itu e região" /></label>
      {error && <p className="form-error full">{error}</p>}
      <button className="button full" disabled={submitting}>
        {submitting ? "Enviando..." : <>Solicitar cadastro de parceiro <FiArrowRight /></>}
      </button>
      <p className="form-microcopy full">Entraremos em contato para validar sua região de atendimento e liberar seu mês gratuito.</p>
    </form>
  );
}

function CompaniesPage({ backendEnabled }) {
  const marketProblems = [
    "Não sabem qual modelo combina com a casa.",
    "Têm dificuldade para visualizar o resultado.",
    "Pedem orçamento sem saber exatamente o que querem.",
    "Falam com várias empresas e muitas vezes não fecham.",
  ];
  const partnerBenefits = [
    [<FiUsers />, "Leads mais qualificados", "Você recebe contatos de pessoas que já demonstraram interesse real e visualizaram possibilidades para a própria casa."],
    [<FiClock />, "Menos perda de tempo", "O cliente chega com uma ideia mais clara do que procura, facilitando a conversa e o orçamento."],
    [<FiCheck />, "Mais chances de fechar", "Quando o cliente visualiza o resultado antes, ele tende a se envolver mais com o projeto."],
    [<FiZap />, "Diferenciação no mercado", "Sua empresa aparece em uma jornada moderna e visual, não só em indicação ou conversa de WhatsApp."],
    [<FiMapPin />, "Presença digital local", "A plataforma ajuda sua empresa a ser encontrada por clientes que pesquisam portões na sua região."],
    [<FiShield />, "Potencial de ticket alto", "Um único serviço fechado pode pagar vários meses da assinatura."],
  ];
  const pricingBenefits = [
    "Recebimento de leads qualificados da sua região",
    "Página de parceiro dentro da plataforma",
    "Participação na rede de fornecedores",
    "Leads de clientes que fizeram simulação com IA",
    "Possibilidade de receber fotos, preferências e dados básicos do projeto",
    "Suporte inicial para cadastro",
    "Sem fidelidade no primeiro mês",
  ];
  const faqItems = [
    ["Sou obrigado a continuar depois do mês grátis?", "Não. O primeiro mês serve para você testar a plataforma. Depois, você decide se quer continuar no plano de R$ 299/mês."],
    ["A plataforma fabrica portões?", "Não. A plataforma conecta clientes interessados a empresas parceiras especializadas."],
    ["Os leads já vêm prontos para orçamento?", "Eles vêm mais qualificados do que um contato comum, porque o cliente já passou pela etapa de simulação e informou dados básicos. A visita técnica e o orçamento final continuam sendo responsabilidade do parceiro."],
    ["Posso atender apenas minha cidade ou região?", "Sim. O parceiro informa as regiões onde atende para receber oportunidades compatíveis."],
    ["Um único cliente pode pagar a assinatura?", "Sim. Como portões normalmente têm ticket de venda alto, um único serviço fechado pode compensar o valor mensal do plano."],
  ];
  return (
    <>
      <Header />
      <main className="partners-page">
        <section className="partner-hero">
          <div className="shell partner-hero-grid">
            <div className="partner-hero-copy">
              <p className="eyebrow">Seja parceiro Meu Portão IA</p>
              <h1>Receba clientes interessados em trocar ou instalar portões na sua região</h1>
              <p>Clientes enviam a foto da casa, simulam modelos de portões com IA e chegam até você mais preparados para pedir orçamento.</p>
              <div className="partner-hero-actions">
                <a href="#cadastro" className="button">Quero ser parceiro <FiArrowRight /></a>
                <a href="#preco" className="button button-secondary">Testar 1 mês grátis</a>
              </div>
              <div className="partner-proof">
                <strong>Você não está pagando por curiosos.</strong>
                <span>Você entra em um canal onde o cliente já viu a casa dele com novos modelos de portão e está mais perto de pedir orçamento.</span>
              </div>
            </div>
            <div className="partner-hero-card">
              <span className="free-badge">1º mês grátis</span>
              <img src={assets.installer} alt="Instalador avaliando projeto de portão com cliente" />
              <div className="price-ribbon">
                <small>Plano parceiro</small>
                <strong>R$ 299/mês</strong>
                <span>Teste por 30 dias antes de continuar.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="shell partner-problem">
          <div>
            <p className="eyebrow">O problema do mercado</p>
            <h2>Muitos orçamentos começam sem clareza.</h2>
            <p>O cliente não sabe se quer portão de correr, basculante, fechado, vazado, ripado, de alumínio ou de ferro. Isso faz o profissional perder tempo com conversas pouco qualificadas. A plataforma ajuda a transformar curiosidade em intenção real de compra.</p>
          </div>
          <ul>
            {marketProblems.map((problem) => <li key={problem}><FiCheck />{problem}</li>)}
          </ul>
        </section>

        <section className="partner-how">
          <div className="shell">
            <div className="center-heading">
              <p className="eyebrow">Como funciona</p>
              <h2>Da simulação ao orçamento em 4 passos</h2>
            </div>
            <div className="partner-steps">
              {[
                [<FiUpload />, "1", "O cliente envia a foto da fachada"],
                [<FiImage />, "2", "A IA gera ideias de portões aplicadas na casa dele"],
                [<FiSliders />, "3", "O cliente escolhe os modelos e informa dados básicos"],
                [<FiUsers />, "4", "O parceiro recebe o lead qualificado e entra em contato"],
              ].map(([icon, number, text]) => (
                <article key={number}>
                  <span>{icon}</span>
                  <strong>{number}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="shell partner-benefits">
          <div className="section-heading">
            <div><p className="eyebrow">O que o parceiro ganha</p><h2>Mais contexto antes da primeira ligação</h2></div>
            <a href="#cadastro" className="button button-secondary">Começar teste grátis <FiArrowRight /></a>
          </div>
          <div className="partner-benefit-grid">
            {partnerBenefits.map(([icon, title, text]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="partner-value">
          <div className="shell partner-value-grid">
            <div>
              <p className="eyebrow">Por que vale R$ 299/mês</p>
              <h2>Um único serviço fechado pode pagar a assinatura com folga.</h2>
              <p>Um portão residencial pode representar uma venda de alguns milhares de reais. Se a plataforma gerar apenas um novo cliente fechado, o plano mensal já pode se pagar.</p>
            </div>
            <ul>
              {["Você não precisa investir sozinho em anúncios.", "Você não precisa criar tecnologia de simulação por IA.", "Você recebe oportunidades já filtradas.", "Você entra em um canal novo de aquisição de clientes.", "Você testa por 30 dias sem pagar mensalidade."].map((item) => <li key={item}><FiCheck />{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="partner-pricing" id="preco">
          <div className="shell">
            <article className="partner-price-card">
              <div>
                <span className="recommended">1º mês grátis</span>
                <p className="eyebrow">Parceiro Padrão</p>
                <h2>R$ 299<span>/mês</span></h2>
                <p>Após o período gratuito, a continuidade é opcional. Você só permanece se quiser continuar recebendo oportunidades pela plataforma.</p>
                <a href="#cadastro" className="button">Começar teste grátis <FiArrowRight /></a>
              </div>
              <ul>
                {pricingBenefits.map((benefit) => <li key={benefit}><FiCheck />{benefit}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section className="shell partner-fit">
          <div>
            <p className="eyebrow">Para quem é indicado</p>
            <h2>Feito para quem atende portões todos os dias.</h2>
          </div>
          <div className="fit-list">
            {["Serralherias", "Fabricantes de portões", "Instaladores de portões automáticos", "Empresas de automação", "Empresas de esquadrias metálicas", "Profissionais que atendem casas, condomínios e pequenos comércios"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="partner-now">
          <div className="shell partner-now-grid">
            <div>
              <p className="eyebrow light">Por que entrar agora?</p>
              <h2>O cliente está cada vez mais visual: ele quer ver antes de comprar.</h2>
            </div>
            <div className="now-points">
              {["Quem responde rápido e mostra boas ideias ganha vantagem.", "A tecnologia ajuda pequenas empresas a competirem com empresas maiores.", "Você entra cedo em uma plataforma especializada em portões.", "Ao invés de disputar apenas preço, você disputa com apresentação, confiança e solução."].map((item) => <p key={item}><FiArrowRight />{item}</p>)}
            </div>
          </div>
        </section>

        <section className="shell trust-notes">
          {["Simulações são ilustrativas e o orçamento final depende de medição e avaliação técnica.", "Os parceiros continuam responsáveis pelo orçamento, fabricação, instalação, garantia e atendimento ao cliente.", "A plataforma atua como canal de conexão e qualificação de oportunidades."].map((note) => <article key={note}><FiShield /><p>{note}</p></article>)}
        </section>

        <section className="shell partner-faq">
          <div className="section-heading"><div><p className="eyebrow">FAQ</p><h2>Perguntas comuns dos parceiros</h2></div></div>
          <div className="faq-list">
            {faqItems.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="shell partner-form-section" id="cadastro">
          <div>
            <p className="eyebrow">Cadastro de parceiro</p>
            <h2>Pronto para receber clientes mais preparados para comprar?</h2>
            <p>Entre como parceiro, teste por 30 dias grátis e veja como a simulação com IA pode ajudar sua empresa a vender mais portões.</p>
          </div>
          <PartnerForm backendEnabled={backendEnabled} />
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
          ["1. Imagens da fachada", "Você envia a imagem voluntariamente para criar simulações de portões. Neste MVP, a imagem é usada apenas no navegador e não é salva no banco."],
          ["2. Dados de contato", "Nome, WhatsApp, cidade, bairro e preferências são salvos no Convex quando você solicita orçamento ou demonstra interesse em ser parceiro."],
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

export function App({ backendEnabled = false }) {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const page = useMemo(() => {
    if (path === "/") return <HomePage />;
    if (path === "/simular") return <SimulatorPage backendEnabled={backendEnabled} />;
    if (path === "/empresas") return <CompaniesPage backendEnabled={backendEnabled} />;
    if (path === "/privacidade") return <PrivacyPage />;
    return <NotFound />;
  }, [path, backendEnabled]);
  return page;
}
