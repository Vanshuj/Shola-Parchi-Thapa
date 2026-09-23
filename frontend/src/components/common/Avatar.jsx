const PALETTE = ['#93000b', '#855300', '#264191', '#b91c1c'];
export default function Avatar({ username, size = 40 }) {
    const initial = username.charAt(0).toUpperCase();
    const color = PALETTE[username.charCodeAt(0) % PALETTE.length];
    return (<div className="flex items-center justify-center rounded-full font-display font-bold text-white shrink-0" style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.45 }} aria-hidden="true">
      {initial}
    </div>);
}
