import React, { useState, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import Nweet from "../components/Nweet";
import { dbService, storageService } from "../fbase";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachement, setAttachement] = useState("");

  // const getNweets = async () => {
  //   const dbNweets = await dbService.collection("nweets").get();
  //   dbNweets.forEach(document => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     }
  //     setNweets(prev => [nweetObject, ...prev]);
  //   });
  // }

  useEffect(() => {
    // getNweets();
    dbService.collection("nweets").onSnapshot(snapshot => {
      const nweetArray = snapshot.docs.map(doc => ( 
        { id: doc.id, ...doc.data()} 
        ));
        setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachementUrl = "";
    if (attachement) {
      const attachementRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachementRef.putString(attachement, "data_url");
      attachementUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachementUrl
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachement("");
  };

  const onChange = (event) => {
    const {
      target: {value},
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const { target: { files }} = event;
    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {currentTarget: { result }} = finishedEvent;
      setAttachement(result);
    };
    reader.readAsDataURL(theFile);
  }

  const onClearAttachement = () => setAttachement(null);

  return (<div>
    <form onSubmit={onSubmit}>
      <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Nweet" />
      { attachement && (
        <div>
          <img src={attachement} width="50px" height="50px" />
          <button onClick={onClearAttachement}>Clear</button>
        </div>
      )}
    </form>
    <div>
      {
        nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))
      }
    </div>
  </div>);  
}

export default Home;