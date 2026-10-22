import "./Window.css";

function Window({ title, children, onClose }) {
  return (
    <div className="window">
      <div className="window-header">
        <span>{title}</span>

        {onClose ? <button className="close-button" aria-label={`Close ${title}`} onClick={onClose}>×</button> : title ? <span aria-hidden="true">◇</span> : null}
      </div>

      <div className="window-content">
        {children}
      </div>
    </div>
  );
}

export default Window;
