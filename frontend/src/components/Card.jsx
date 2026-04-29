const Card = ({ title, children }) => {
  const initials = title
    ? title
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <div className="card-avatar">{initials}</div>
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
