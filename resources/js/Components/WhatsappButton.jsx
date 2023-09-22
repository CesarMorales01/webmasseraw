export default function WhastsappButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center px-4 py-2 bg-blue-600 border border-gray-300 rounded-md font-semibold text-xs text-black-700 uppercase tracking-widest shadow-sm hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ${
                    disabled && 'opacity-0'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}