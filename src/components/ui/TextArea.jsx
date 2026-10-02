export default function TextArea({ minHeight = 64, style, ...props }) {
  return <textarea className="textarea" style={{ minHeight, ...style }} {...props} />;
}
