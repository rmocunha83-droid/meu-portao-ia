import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
  FiInbox,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
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
  partner2bHero: "/assets/partner-2b-hero.webp",
  partner2bStepPhoto: "/assets/partner-2b-step-photo.webp",
  partner2bStepModels: "/assets/partner-2b-step-models.webp",
  partner2bStepStyle: "/assets/partner-2b-step-style.webp",
  partner2bStepPartner: "/assets/partner-2b-step-partner.webp",
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

const generatedModelNames = [
  "Transformação elegante",
  "Portão com presença",
];

function generatedDescription(index, selectedStyles) {
  const styleText = selectedStyles.length ? selectedStyles.join(", ").toLowerCase() : "o estilo escolhido";
  const descriptions = [
    `Opção com foco em ${styleText}, mantendo a mesma casa e melhorando a presença da entrada.`,
    "Uma leitura mais sofisticada da fachada, com portão novo, acabamento limpo e iluminação mais bonita.",
    "Alternativa para comparar proporção, privacidade e valorização visual antes de pedir orçamento.",
  ];
  return descriptions[index] || descriptions[0];
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const AI_UPLOAD_MAX_EDGE = 1600;
const AI_UPLOAD_JPEG_QUALITY = 0.85;

function optimizedFileName(name) {
  const cleanName = name || "fachada";
  return cleanName.replace(/\.[^.]+$/, "") + "-otimizada.jpg";
}

async function optimizeImageForAi(file) {
  if (!file.type?.startsWith("image/")) return file;

  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const imageElement = new Image();
      imageElement.onload = () => resolve(imageElement);
      imageElement.onerror = () => reject(new Error("Não foi possível preparar a foto."));
      imageElement.src = imageUrl;
    });

    const scale = Math.min(1, AI_UPLOAD_MAX_EDGE / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", AI_UPLOAD_JPEG_QUALITY);
    });

    if (!blob || blob.size >= file.size) return file;
    return new File([blob], optimizedFileName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

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

function Header({ partnerLanding = false }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={partnerLanding ? "site-header partner-simple-header" : "site-header"}>
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
      {partnerLanding ? (
        <a href="#cadastro" className="button partner-header-cta">
          <span className="partner-cta-desktop">Testar 1 mês grátis</span>
          <span className="partner-cta-mobile">Teste grátis</span>
        </a>
      ) : (
        <>
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
        </>
      )}
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
            <h1>Não é sua casa que está sem graça. É o portão que ficou para trás.</h1>
            <p className="hero-description">
              Use a inteligência artificial para visualizar diferentes modelos
              de portões na fachada da sua casa e conecte-se com instaladores
              de confiança.
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
        simulationId: model.simulationId || undefined,
        selectedGeneratedImageId: model.storageId || undefined,
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
  const [photoFile, setPhotoFile] = useState(null);
  const [selected, setSelected] = useState(["Moderno"]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedResults, setGeneratedResults] = useState([]);
  const [generationError, setGenerationError] = useState("");
  const [leadModel, setLeadModel] = useState(null);
  const imageGenerationEndpoint = import.meta.env.VITE_CONVEX_SITE_URL
    ? `${import.meta.env.VITE_CONVEX_SITE_URL}/generate-gate-simulation`
    : "";

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const toggleStyle = (style) => {
    setSelected((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setGenerationError("A foto precisa ter até 10 MB.");
      return;
    }
    setPhotoFile(file);
    setImage(URL.createObjectURL(file));
    setGenerated(false);
    setGeneratedResults([]);
    setGenerationError("");
    try {
      const optimizedFile = await optimizeImageForAi(file);
      setPhotoFile(optimizedFile);
    } catch {
      setPhotoFile(file);
      setGenerationError("A foto foi aceita, mas não conseguimos compactá-la. A simulação ainda pode ser gerada normalmente.");
    }
  };

  const generate = async () => {
    if (!photoFile) return;
    if (!imageGenerationEndpoint) {
      setGenerationError("A conexão com a IA ainda precisa da URL do backend Convex.");
      return;
    }

    setLoading(true);
    setGenerated(false);
    setGeneratedResults([]);
    setGenerationError("");

    const formData = new FormData();
    formData.append("facade", photoFile, photoFile.name || "fachada.jpg");
    formData.append("styles", selected.join(", "));
    formData.append("description", description);

    try {
      const response = await fetch(imageGenerationEndpoint, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Não foi possível gerar a simulação agora.");
      }

      const images = Array.isArray(payload?.images) ? payload.images : [];
      if (!images.length) {
        throw new Error("A IA não retornou imagens. Tente novamente com outra foto.");
      }

      setGeneratedResults(images.map((item, index) => ({
        name: item.name || generatedModelNames[index] || `Opção ${index + 1}`,
        description: item.description || generatedDescription(index, selected),
        image: item.url,
        simulationId: payload?.simulationId || null,
        storageId: item.storageId || null,
        position: "50%",
        aiGenerated: true,
      })));
      setGenerated(true);
      window.setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "Não foi possível gerar a simulação agora.");
    } finally {
      setLoading(false);
    }
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
            <div className="photo-tip"><FiShield /><span><strong>Sua foto não fica pública.</strong> Ela é enviada com segurança para gerar a simulação e não é salva no banco deste MVP.</span></div>
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
              {loading ? <><span className="spinner" /> Criando com IA...</> : <><FiZap /> Gerar simulação com IA</>}
            </button>
            {!image && <small className="disabled-note">Envie uma foto para liberar a geração.</small>}
            {generationError && <p className="form-error">{generationError}</p>}
          </div>
        </section>

        {(loading || generated) && (
          <section className="results-section" id="results">
            <div className="shell">
              <div className="section-heading">
                <div><p className="eyebrow">Sua seleção</p><h2>{loading ? "A IA está redesenhando sua fachada" : "Ideias geradas para sua fachada"}</h2></div>
              </div>
              {loading ? (
                <div className="loading-panel">
                  <div className="scan-line" />
                  <img src={image} alt="" />
                  <p>Analisando proporções, abertura e estilo da fachada...</p>
                </div>
              ) : (
                <div className="result-grid">
                  {generatedResults.map((result, index) => (
                    <article className="result-card" key={result.name}>
                      <div className="result-image">
                        {result.aiGenerated ? (
                          <div className="ai-before-after">
                            <div>
                              <img src={image} alt="Fachada original enviada" />
                              <span>Antes</span>
                            </div>
                            <div>
                              <img src={result.image} alt={result.name} style={{ objectPosition: result.position }} />
                              <span>Depois</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <img src={result.image} alt={result.name} style={{ objectPosition: result.position }} />
                            <span>Modelo {index + 1}</span>
                          </>
                        )}
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
  const proofSteps = [
    [<FiImage />, "Foto da fachada"],
    [<FiGrid />, "Modelo escolhido"],
    [<FiUsers />, "Contato com contexto"],
  ];
  const comparisonItems = [
    ["cliente indeciso", "Quero trocar meu portão...", "cliente com referência visual", "Já vi como fica na minha casa e quero esse modelo."],
    ["conversa fria", "Me fala os modelos e os preços.", "desejo já criado", "Quero saber quanto fica para fazer igual a esse daqui."],
    ["disputar preço", "Qual o menor preço?", "vender solução", "Quero qualidade para valorizar minha casa e ficar seguro."],
  ];
  const processSteps = [
    [assets.partner2bStepPhoto, "Cliente envia foto da fachada"],
    [assets.partner2bStepModels, "IA mostra modelos na casa dele"],
    [assets.partner2bStepStyle, "Cliente escolhe estilos e informa região"],
    [assets.partner2bStepPartner, "Parceiro recebe um contato mais preparado"],
  ];
  const priceBenefits = [
    "Contatos com contexto visual da fachada",
    "Pessoas realmente interessadas",
    "Oportunidades na sua região",
    "Sem fidelidade depois do teste",
  ];
  const trustItems = [
    [<FiUsers />, "Feito para serralherias, instaladores e fabricantes de portões."],
    [<FiMapPin />, "Oportunidades compatíveis com sua região de atendimento."],
    [<FiZap />, "Mais conversas boas, mais orçamentos e menos curiosos."],
    [<FiShield />, "Plataforma segura, parceiros verificados e suporte humano."],
  ];
  const faqItems = [
    [
      "O Meu Portão IA cobra comissão pelas vendas?",
      "Não. O valor da venda fica integralmente com a empresa parceira. A plataforma cobra apenas a mensalidade do plano parceiro depois do primeiro mês gratuito.",
    ],
    [
      "O site fabrica ou instala portões?",
      "Não. O Meu Portão IA não fabrica, vende nem instala portões. A plataforma ajuda o cliente a visualizar modelos na própria fachada e conecta esse interesse com empresas parceiras da região.",
    ],
    [
      "Os contatos já chegam prontos para orçamento?",
      "Eles chegam mais preparados do que um contato comum, porque a pessoa já enviou a fachada, viu possibilidades e escolheu uma direção visual. A visita técnica, medidas e orçamento final continuam com o parceiro.",
    ],
    [
      "Sou obrigado a continuar depois do mês grátis?",
      "Não. O primeiro mês serve para testar a plataforma sem risco. Depois, você decide se quer continuar no plano de R$ 299/mês.",
    ],
    [
      "Posso atender só algumas cidades ou bairros?",
      "Sim. No cadastro você informa sua região de atendimento para receber oportunidades compatíveis com onde sua empresa realmente trabalha.",
    ],
  ];

  return (
    <>
      <Header partnerLanding />
      <main className="partners-page">
        <section className="partner-landing-hero">
          <div className="shell partner-landing-grid">
            <div className="partner-landing-copy">
              <p className="eyebrow">Mais que leads: intenção de compra</p>
              <h1>Receba contatos de quem já viu o portão novo na própria casa</h1>
              <p>
                A pessoa não chega perguntando qualquer coisa. Ela chega com uma
                fachada, uma ideia visual e vontade de saber quanto custa
                transformar aquilo em realidade.
              </p>
              <a href="#cadastro" className="button partner-main-cta">
                Quero testar 30 dias grátis <FiArrowRight />
              </a>
              <small className="partner-hero-note">
                <FiShield /> Primeiro mês grátis. Depois R$ 299/mês. Sem fidelidade.
              </small>
            </div>

            <div className="partner-lead-visual">
              <img src={assets.partner2bHero} alt="Cliente vendo opções de portão com um parceiro Meu Portão IA" />
            </div>
          </div>
        </section>

        <section className="partner-desire-strip">
          <div className="shell">
            <h2>Você entra na conversa depois que o desejo já foi criado.</h2>
            <div className="partner-proof-flow">
              {proofSteps.map(([icon, label]) => (
                <span key={label}>{icon}<strong>{label}</strong></span>
              ))}
            </div>
          </div>
        </section>

        <section className="partner-change shell">
          <p className="eyebrow">O que muda para sua venda</p>
          <h2>Menos curiosidade solta. Mais conversa com intenção.</h2>
          <div className="partner-change-grid">
            {comparisonItems.map(([beforeTitle, beforeText, afterTitle, afterText]) => (
              <article key={beforeTitle}>
                <p className="change-label before">Antes:</p>
                <h3>{beforeTitle}</h3>
                <blockquote>{beforeText}</blockquote>
                <FiArrowRight />
                <p className="change-label after">Agora:</p>
                <h3>{afterTitle}</h3>
                <blockquote>{afterText}</blockquote>
              </article>
            ))}
          </div>
        </section>

        <section className="partner-flow">
          <div className="shell">
            <div className="center-heading">
              <p className="eyebrow">Como funciona</p>
              <h2>Como o lead chega até você</h2>
            </div>
            <div className="partner-flow-grid">
              {processSteps.map(([image, text], index) => (
                <article key={text}>
                  <strong>{index + 1}</strong>
                  <img src={image} alt="" />
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="partner-faq-section shell">
          <div className="partner-faq-heading">
            <p className="eyebrow">Perguntas frequentes</p>
            <h2>Antes de entrar, o que você precisa saber</h2>
            <p>Respostas diretas para deixar claro como a parceria funciona e onde o Meu Portão IA entra na venda.</p>
          </div>
          <div className="partner-faq-list">
            {faqItems.map(([question, answer], index) => (
              <details key={question} open={index < 2}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="partner-signup shell" id="cadastro">
          <article className="partner-plan-card">
            <span>Experimente sem risco</span>
            <h2>1º mês grátis</h2>
            <p>Depois do teste</p>
            <strong>R$ 299<small>/mês</small></strong>
            <ul>
              {priceBenefits.map((benefit) => <li key={benefit}><FiCheck />{benefit}</li>)}
            </ul>
            <div className="cancel-note"><FiShield /> Cancele quando quiser. Sem burocracia.</div>
          </article>
          <div className="partner-signup-form">
            <p className="eyebrow">Cadastro de parceiro</p>
            <h2>Solicite seu cadastro de parceiro</h2>
            <p>Preencha os dados e nossa equipe entra em contato para validar sua região, explicar o teste gratuito e liberar o acesso.</p>
            <PartnerForm backendEnabled={backendEnabled} />
          </div>
        </section>

        <section className="shell partner-trust-row">
          {trustItems.map(([icon, text]) => (
            <article key={text}>{icon}<p>{text}</p></article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

function formatDate(timestamp) {
  if (!timestamp) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function whatsappNumber(value = "") {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function buildPartnerMessage(lead) {
  const selectedImage = lead.selectedGeneratedImageUrl
    ? `\nImagem escolhida: ${lead.selectedGeneratedImageUrl}`
    : "";
  const originalImage = lead.simulation?.originalImageUrl
    ? `\nFoto original: ${lead.simulation.originalImageUrl}`
    : "";

  return [
    "Novo lead do Meu Portão IA",
    "",
    `Nome: ${lead.name}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Cidade/bairro: ${lead.city} - ${lead.neighborhood}`,
    `Prazo: ${lead.timing}`,
    `Imóvel: ${lead.property}`,
    `Modelo escolhido: ${lead.selectedModel}`,
    `Preferências: ${lead.selectedStyles?.join(", ") || "não informado"}`,
    lead.description ? `Pedido: ${lead.description}` : null,
    selectedImage || null,
    originalImage || null,
    "",
    "O cliente aceitou receber contato de empresas parceiras para orçamento.",
  ].filter(Boolean).join("\n");
}

function whatsAppUrl(partner, message) {
  const number = whatsappNumber(partner?.whatsapp || "");
  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function AdminLogin({ draftSecret, setDraftSecret, onSubmit }) {
  return (
    <section className="admin-login shell">
      <p className="eyebrow">Área interna</p>
      <h1>Admin Meu Portão IA</h1>
      <p>Consulte empresas, leads e imagens geradas pelos interessados.</p>
      <form onSubmit={onSubmit} className="admin-login-card">
        <label>
          Senha do admin
          <input
            type="password"
            value={draftSecret}
            onChange={(event) => setDraftSecret(event.target.value)}
            placeholder="Digite a senha configurada no Convex"
            required
          />
        </label>
        <button className="button" type="submit">Entrar no admin <FiArrowRight /></button>
      </form>
    </section>
  );
}

function AdminImageGallery({ simulation, selectedImageUrl }) {
  if (!simulation) {
    return <p className="admin-empty">Este lead ainda não tem imagens salvas.</p>;
  }

  return (
    <div className="admin-gallery">
      {simulation.originalImageUrl && (
        <figure>
          <img src={simulation.originalImageUrl} alt="Foto original enviada pelo interessado" />
          <figcaption>Foto original</figcaption>
        </figure>
      )}
      {simulation.generatedImages?.map((image) => (
        <figure className={selectedImageUrl === image.url ? "selected" : ""} key={image.storageId}>
          <img src={image.url} alt={image.name} />
          <figcaption>{image.name}{selectedImageUrl === image.url ? " escolhida" : ""}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function AdminLeadCard({ lead, partners, adminSecret }) {
  const createDelivery = useMutation(api.deliveries.createLeadDelivery);
  const [partnerId, setPartnerId] = useState(partners[0]?._id || "");
  const [sending, setSending] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const selectedPartner = partners.find((partner) => partner._id === partnerId);
  const message = buildPartnerMessage(lead);
  const url = selectedPartner ? whatsAppUrl(selectedPartner, message) : "";

  const sendToPartner = async () => {
    setDeliveryError("");
    if (!selectedPartner || !url) {
      setDeliveryError("Escolha um parceiro com WhatsApp válido.");
      return;
    }

    try {
      setSending(true);
      await createDelivery({
        adminSecret,
        leadId: lead._id,
        partnerId: selectedPartner._id,
        channel: "whatsapp",
        message,
      });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setDeliveryError(err instanceof Error ? err.message : "Não foi possível registrar o envio.");
    } finally {
      setSending(false);
    }
  };

  return (
    <article className="admin-card admin-lead-card">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">Lead de morador</p>
          <h3>{lead.name}</h3>
          <p>{lead.city} • {lead.neighborhood}</p>
        </div>
        <span>{formatDate(lead.createdAt)}</span>
      </div>
      <div className="admin-details-grid">
        <p><strong>WhatsApp</strong>{lead.whatsapp}</p>
        <p><strong>Prazo</strong>{lead.timing}</p>
        <p><strong>Imóvel</strong>{lead.property}</p>
        <p><strong>Modelo escolhido</strong>{lead.selectedModel}</p>
      </div>
      <p className="admin-note"><strong>Preferências:</strong> {lead.selectedStyles?.join(", ") || "Sem estilos"}</p>
      {lead.description && <p className="admin-note"><strong>Pedido:</strong> {lead.description}</p>}
      <AdminImageGallery simulation={lead.simulation} selectedImageUrl={lead.selectedGeneratedImageUrl} />
      <div className="lead-delivery-box">
        <div>
          <p className="eyebrow">Enviar para parceiro</p>
          <h4>Compartilhar este lead por WhatsApp</h4>
          <p>O envio fica registrado aqui antes de abrir a conversa com a mensagem pronta.</p>
        </div>
        <div className="lead-delivery-actions">
          <select value={partnerId} onChange={(event) => setPartnerId(event.target.value)} disabled={!partners.length}>
            {partners.length ? partners.map((partner) => (
              <option value={partner._id} key={partner._id}>
                {partner.company} ({partner.deliveryCount || 0} leads)
              </option>
            )) : <option>Nenhum parceiro cadastrado</option>}
          </select>
          <button className="button" type="button" onClick={sendToPartner} disabled={sending || !partners.length}>
            {sending ? "Registrando..." : <><FiMessageCircle /> Enviar no WhatsApp</>}
          </button>
        </div>
        {deliveryError && <p className="form-error full">{deliveryError}</p>}
        {lead.deliveries?.length > 0 && (
          <div className="delivery-history">
            <strong>Já enviado para:</strong>
            {lead.deliveries.map((delivery) => (
              <span key={delivery._id}>
                {delivery.partnerCompany} em {formatDate(delivery.createdAt)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function AdminPartnerCard({ partner }) {
  return (
    <article className="admin-card">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">Parceiro</p>
          <h3>{partner.company}</h3>
          <p>{partner.city}</p>
        </div>
        <span>{formatDate(partner.createdAt)}</span>
      </div>
      <div className="admin-details-grid">
        <p><strong>Responsável</strong>{partner.owner}</p>
        <p><strong>WhatsApp</strong>{partner.whatsapp}</p>
        <p><strong>Serviço</strong>{partner.serviceType || "Não informado"}</p>
        <p><strong>Região</strong>{partner.serviceRegion || "Não informada"}</p>
        <p><strong>Leads recebidos</strong>{partner.deliveryCount || 0}</p>
        <p><strong>Último envio</strong>{partner.lastDeliveredAt ? formatDate(partner.lastDeliveredAt) : "Nenhum envio"}</p>
      </div>
    </article>
  );
}

function AdminSimulationCard({ simulation }) {
  return (
    <article className="admin-card">
      <div className="admin-card-head">
        <div>
          <p className="eyebrow">Simulação salva</p>
          <h3>{simulation.selectedStyles?.join(", ") || "Sem estilo informado"}</h3>
          <p>{formatDate(simulation.createdAt)}</p>
        </div>
      </div>
      {simulation.description && <p className="admin-note">{simulation.description}</p>}
      <AdminImageGallery simulation={simulation} />
    </article>
  );
}

function AdminPage({ backendEnabled }) {
  const [draftSecret, setDraftSecret] = useState(() => sessionStorage.getItem("adminSecret") || "");
  const [adminSecret, setAdminSecret] = useState(() => sessionStorage.getItem("adminSecret") || "");
  const overview = useQuery(
    api.simulations.adminOverview,
    backendEnabled && adminSecret ? { adminSecret, limit: 30 } : "skip",
  );

  const submit = (event) => {
    event.preventDefault();
    const value = draftSecret.trim();
    if (!value) return;
    sessionStorage.setItem("adminSecret", value);
    setAdminSecret(value);
  };

  const logout = () => {
    sessionStorage.removeItem("adminSecret");
    setAdminSecret("");
    setDraftSecret("");
  };

  if (!backendEnabled) {
    return (
      <>
        <Header />
        <main className="admin-page">
          <section className="admin-login shell">
            <p className="eyebrow">Área interna</p>
            <h1>Admin indisponível</h1>
            <p>A conexão com o Convex precisa estar ativa para consultar os dados.</p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!adminSecret) {
    return (
      <>
        <Header />
        <main className="admin-page">
          <AdminLogin draftSecret={draftSecret} setDraftSecret={setDraftSecret} onSubmit={submit} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="admin-page">
        <section className="admin-hero shell">
          <div>
            <p className="eyebrow">Área interna</p>
            <h1>Painel de leads</h1>
            <p>Veja os interessados, imagens geradas pela IA e empresas cadastradas.</p>
          </div>
          <button className="button button-secondary" onClick={logout}>Sair</button>
        </section>

        {overview === undefined ? (
          <section className="shell admin-loading">Carregando dados...</section>
        ) : !overview.ok ? (
          <section className="shell admin-error">
            <strong>{overview.error}</strong>
            <button className="button" onClick={logout}>Tentar outra senha</button>
          </section>
        ) : (
          <>
            <section className="admin-stats shell">
              <article><FiInbox /><strong>{overview.leads.length}</strong><span>Leads recentes</span></article>
              <article><FiUsers /><strong>{overview.partners.length}</strong><span>Empresas recentes</span></article>
              <article><FiImage /><strong>{overview.simulations.length}</strong><span>Simulações recentes</span></article>
            </section>

            <section className="admin-section shell">
              <div className="section-heading">
                <div><p className="eyebrow">Moradores</p><h2>Leads com imagens</h2></div>
              </div>
              <div className="admin-list">
                {overview.leads.length ? overview.leads.map((lead) => (
                  <AdminLeadCard
                    lead={lead}
                    partners={overview.partners}
                    adminSecret={adminSecret}
                    key={lead._id}
                  />
                )) : <p className="admin-empty">Nenhum lead de morador ainda.</p>}
              </div>
            </section>

            <section className="admin-section shell">
              <div className="section-heading">
                <div><p className="eyebrow">Empresas</p><h2>Parceiros cadastrados</h2></div>
              </div>
              <div className="admin-list compact">
                {overview.partners.length ? overview.partners.map((partner) => (
                  <AdminPartnerCard partner={partner} key={partner._id} />
                )) : <p className="admin-empty">Nenhuma empresa cadastrada ainda.</p>}
              </div>
            </section>

            <section className="admin-section shell">
              <div className="section-heading">
                <div><p className="eyebrow">Banco de imagens</p><h2>Simulações recentes</h2></div>
              </div>
              <div className="admin-list">
                {overview.simulations.length ? overview.simulations.map((simulation) => (
                  <AdminSimulationCard simulation={simulation} key={simulation._id} />
                )) : <p className="admin-empty">Nenhuma simulação salva ainda.</p>}
              </div>
            </section>
          </>
        )}
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
          ["1. Imagens da fachada", "Você envia a imagem voluntariamente para criar simulações de portões. A foto original e as imagens geradas pela IA podem ser salvas no Convex Storage para que a equipe do Meu Portão IA consiga acompanhar o pedido e encaminhar o contexto correto aos parceiros."],
          ["2. Dados de contato", "Nome, WhatsApp, cidade, bairro, preferências e o modelo escolhido são salvos no Convex quando você solicita orçamento ou demonstra interesse em ser parceiro."],
          ["3. Compartilhamento", "Seus dados e imagens relacionadas ao pedido poderão ser compartilhados com empresas parceiras somente quando você marcar a autorização no formulário de orçamento."],
          ["4. Exclusão", "Você pode solicitar a exclusão dos dados enviados pelos canais de contato da plataforma. A versão futura terá um fluxo dedicado para esse pedido."],
          ["5. Natureza do projeto", "O Meu Portão IA apresentado aqui é um MVP demonstrativo. Não há pagamento no site, e o acesso interno aos leads é protegido por senha administrativa."],
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
    if (path === "/admin") return <AdminPage backendEnabled={backendEnabled} />;
    if (path === "/privacidade") return <PrivacyPage />;
    return <NotFound />;
  }, [path, backendEnabled]);
  return page;
}
