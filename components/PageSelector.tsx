import React, { FunctionComponent } from "react"

const PageSelector: FunctionComponent<{ page: string; setPage: React.Dispatch<React.SetStateAction<string>> }> = ({
    page,
    setPage,
}) => {
    const pages = ["Home", "Converter"]

    const changePage = (pg: string) => {
        setPage(pg)
    }
    return (
        <div className="flex gap-6 justify-center items-center mb-6">
            {pages.map((pg, i) => {
                const selected = pg === page ? "border-b text-blue-500 border-blue-500 font-semibold" : ""
                return (
                    <div
                        className={`cursor-pointer text-gray-600 hover:text-blue-300 active:text-blue-400 select-none ${selected}`}
                        key={i}
                        onClick={() => changePage(pg)}
                    >
                        {pg}
                    </div>
                )
            })}
        </div>
    )
}

export default PageSelector
