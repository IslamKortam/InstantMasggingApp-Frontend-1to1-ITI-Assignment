import axios from "axios";
import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
const serverURL = 'http://localhost:5000';


const socket = io(serverURL);

export default function ChatApp(){
    const [inputText, setInputText] = useState('');
    const [msgs, setMsgs] = useState([]);

    const msgsRef = useRef(msgs);
    msgsRef.current = msgs;

    const handleTextChange = (value) => {
        setInputText(value);
    }

    
    const handleSubmit = (e) => {
        e.preventDefault();
        setMsgs(msgs.concat({msg: inputText, mine: true}));
        socket.emit('message', inputText);
        setInputText('');
    }

    useEffect(() => {
        socket.on('new-message', (message) => {
            console.log(msgsRef.current);
            setMsgs(msgsRef.current.concat({msg: message, mine: false}));
        })
    }, []);

    return(
        <>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <h1 className="col-md-2">ChatApp</h1>
                </div>
                <div className="row d-flex justify-content-center" >
                    <form action="" className="col-md-3">
                        <input type="text" value={inputText} onChange={(e)=>{handleTextChange(e.target.value)}}/>
                        <input type="submit" onClick={handleSubmit} value="Send"/>
                    </form>
                </div>
                <br /><br />
                <div className="row d-flex justify-content-center">
                    <ul className="list-group col-md-4">
                        {msgs.map((item, index) => <li key={index} className = {item.mine ? "list-group-item" : "list-group-item active"}>{item.msg}</li>)}
                    </ul>
                </div>
            </div>
        </>

    )
}