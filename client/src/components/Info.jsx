function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-sage">{label}</p>
      <p className="text-lg font-semibold text-deep-brown mt-1">{value}</p>
    </div>
  );
}

export default Info;
