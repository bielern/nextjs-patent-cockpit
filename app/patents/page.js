export default async function Page({ children }) {
    const patents = await getPatents()
  return (
    <div>
      <h1>Patents</h1>
      <div className="flex flex-col gap-4 pt-4 w-fit">
        {patents.map(patent => <Patent key={patent.id} {...patent} />)}
      </div>
      {children}
    </div>
  )
}

function getPatents() {
  return Promise.resolve([
    {
      id: 1,
      name: 'Patent 1',
    },
    {
      id: 2,
      name: 'Patent 2',
    },
  ])
}

function Patent({name}) {
    return <div className="bg-slate-200 p-4 rounded-lg">
        <h2>{name}</h2>
    </div>
}