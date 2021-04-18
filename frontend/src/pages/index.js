// Outputs:
// BackendStack.GraphQLAPIKey = da2-ujar5xzzbrbwdipca3hctzbtce
// BackendStack.GraphQLAPIURL = https://z3yh4oouzjcmfn6kywydp2zeze.appsync-api.us-east-1.amazonaws.com/graphql
// BackendStack.StackRegion = us-east-1
import React, { useState } from "react"
import { useQuery, gql, useMutation } from "@apollo/client"
import shortid from "shortid"

const GET_BOOKMARKS = gql`
  query {
    getBookMarks {
      id
      title
      url
    }
  }
`
const CREATE_BOOKMARK = gql`
  mutation createTodo($bookmark: BookMarkInput!) {
    addBookMark(bookmark: $bookmark) {
      id
      title
      url
    }
  }
`

let ID = shortid.generate()

const Index = () => {

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [id, setId] = useState(ID)
  const { data, loading, refetch  } = useQuery(GET_BOOKMARKS)
  const [createBookmark] = useMutation(CREATE_BOOKMARK)

  const AddBookmark = async () => {
    const bookmark = {
      id,
      title,
      url 
    }
      await createBookmark({ variables: { bookmark } })
      console.log("Adding Bookmark:", bookmark)
      setTitle("")
      setUrl("")
      ID = shortid.generate()
      setId(ID)
      refetch()
  }
  

  return (

    <div>

      {loading && <h1>Loading ...</h1>}

      <label> Bookmark Title: <input value={title} onChange={({ target }) => setTitle(target.value)} /> </label>
      <label> Bookmark URL: <input value={url} onChange={({ target }) => setUrl(target.value)} /> </label>
      <button onClick={() => AddBookmark()}>Add Bookmark</button>


      {!loading &&
        data &&
        data.getBookMarks.map(item => (
          <div style={{ marginLeft: "1rem", marginTop: "2rem" }} key={item.id}>
            <h4>{item.title}</h4>
            <h4>{item.url}</h4>
          </div>
        ))}

    </div>

  )
}

export default Index


