export default function Page({ children }) {
  return (
    <div>
      <h1>Signup</h1>
      <form className="flex flex-col gap-4 w-fit" method="post" action="/api/auth/signup">
        <label>Email <br/>
            <input type="email" name="email" />
        </label>
        <label>Password <br/>
            <input type="password" name="password" />
        </label>

        <input type="submit" value="Sign Up" className="btn" />
      </form>
    </div>
  )
}
