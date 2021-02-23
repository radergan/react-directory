import React, { useState, useEffect } from 'react'
import { filter } from "fuzzaldrin-plus"
import { v4 as uuidv4 } from 'uuid';
import { Table, Avatar, Text } from 'evergreen-ui'
import PageHead from './components/PageHead'
import './App.css';

function App() {

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            let randomUsers = "https://randomuser.me/api/?results=200&nat=us";
            const response = await fetch(randomUsers);
            const myUsers = await response.json();
            setUsers(myUsers.results);
        }
        catch (err){
            console.log(err.response);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);
    
    const people = items => {
        if (searchQuery.length === 0) return users
        return users.filter(u => {
            const full = `${u.name.first} ${u.name.last}`;
            const result = filter([full], searchQuery)
            return result.length === 1
        })
    }

    const handleFilterChange = value => {
        setSearchQuery(value)
    }

    const renderRow = ({users}) => {
        return ( 
            <Table.Row key={uuidv4()}>
                <Table.Cell display="flex" alignItems="center">
                    <Avatar name={`${users.name.first} ${users.name.last}`}/>
                    <Text marginLeft={10} size={300}>
                        {users.name.first} {users.name.last}
                    </Text>
                </Table.Cell>
                <Table.TextCell>
                    {users.location.city}, {users.location.state}
                </Table.TextCell>
                <Table.TextCell>
                    {users.email}
                </Table.TextCell>
            </Table.Row>
        )
    }

    return (   
        <div className="body-context">
            <PageHead />   
            <Table border>
                <Table.Head>
                    <Table.SearchHeaderCell
                        onChange={handleFilterChange}
                        value={searchQuery}
                    />
                    <Table.TextCell>Title</Table.TextCell>
                    <Table.TextCell>Location</Table.TextCell>
                </Table.Head>
                <Table.VirtualBody height={640}>
                    {people(searchQuery).map(item => renderRow({ users: item }))}
                </Table.VirtualBody>
            </Table>
        </div>
    )
}
export default App;
