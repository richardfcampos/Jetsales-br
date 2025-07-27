interface ConnectionStatusProps {
  phone?: string;
  statusClasses: string;
  statusTextClasses: string;
  statusPhoneClasses: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  phone,
  statusClasses,
  statusTextClasses,
  statusPhoneClasses,
}) => {
  if (!phone) return null;

  return (
    <div className={statusClasses}>
      <p className={statusTextClasses}>
        Connected as: <span className={statusPhoneClasses}>{phone}</span>
      </p>
    </div>
  );
}; 