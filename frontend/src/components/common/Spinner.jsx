export default function Spinner({ size = 16 }) {
    return (<span className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent" style={{ width: size, height: size }} aria-hidden="true"/>);
}
