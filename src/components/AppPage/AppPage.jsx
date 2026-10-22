import "./AppPage.css";

function AppPage({ title, children, goHome }) {
  return (
    <div className="app-page">

      <div className="app-header">

        <div className="app-title">
          {title}
        </div>

        <button
          className="close-button"
          aria-label="Close application and return to desktop"
          onClick={goHome}
        >
          ✕
        </button>

      </div>

      <main id="main" tabIndex={-1} className="app-content"><div className="page-inner">{children}</div></main>

    </div>
  );
}

export default AppPage;
