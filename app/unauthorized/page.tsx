export default function Unauthorized() {
    return (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white p-8 dark:bg-black">
            <div className="text-center space-y-5">
                <h1 className="text-4xl font-bold text-danger">401 - Unauthorized</h1>
                <p className="text-xl text-muted-foreground">Oops! You don't have permission to access this page.</p>
            </div>
        </div>
    )
}

