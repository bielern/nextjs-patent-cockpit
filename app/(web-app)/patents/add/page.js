import Link from "next/link";

export default function Page({ children }) {
  return (
    <form className="flex flex-col gap-4 w-fit" method="post" action="/api/patent">
      <h2>Add Patent</h2>
      <label>Name<br/>
        <input type="text" name="name" required autoFocus/>
      </label>
          <div className="flex flex-row-reverse gap-2">
              <input type="submit" value="Submit" className="btn" />
              <Link href="/patents" className="btn-tertiary">Cancel</Link>
          </div>
    </form>
  )
}