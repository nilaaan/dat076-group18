import { useEffect, useState } from 'react';
import { SunMoon } from 'lucide-react';

function ThemeToggle() {
    const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
    });

    const toggleTheme = () => {
        setTheme((curTheme) => (curTheme === "dark" ? "light" : "dark"));
    };

    return (
        <button onClick={toggleTheme} className="hover:text-primary-400-600">
            <SunMoon size={28} />
        </button>
    )
}

export default ThemeToggle;