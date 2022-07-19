const Converter = () => {
    return (
        <div className="flex flex-col w-7/12 border items-center p-4 gap-4">
            <span className="text-6xl">👻</span>
            <span>
                Please see{" "}
                <a
                    className="cursor-pointer text-blue-500 hover:text-blue-700 active:text-blue-600"
                    href="https://cairo-utils-web.vercel.app/"
                >
                    here
                </a>{" "}
                for a unit converter.
            </span>
        </div>
    )
}

export default Converter
