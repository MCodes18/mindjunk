import "./DesktopIcon.css";

function DesktopIcon({ icon, label, onClick }) {
  return (
   <button type="button" className="desktop-icon" 
   onClick={onClick}>
  <div className="icon-image">
    <img src={icon} alt="" />
  </div>

  <p>{label}</p>
</button>
  );
}

export default DesktopIcon;
