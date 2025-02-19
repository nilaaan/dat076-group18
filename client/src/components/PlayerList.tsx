import { useState } from 'react';
import { Player } from '../Types.ts';
import { Accordion } from '@skeletonlabs/skeleton-react';
import { User } from 'lucide-react';

interface PlayerListProps {
    players: Player[];
}

function PlayerList({ players = [] }: PlayerListProps) {
    const [value, setValue] = useState<string[]>([]);

    return (
        <Accordion value={value} onValueChange={setValue} multiple>
            {players.map((player) => (
                <div key={player.id}>
                    <hr className="hr"></hr>
                    <Accordion.Item value={`${player.id}`}>
                        <Accordion.Control>
                            <div className="flex flex-row gap-2 p-2">
                                <User></User>
                                <p>{player.name}</p>
                            </div>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th className="opacity-50">Position:</th>
                                        <td>{player.position}</td>
                                    </tr>
                                    <tr>
                                        <th className="opacity-50">#</th>
                                        <td>{player.number}</td>
                                    </tr>
                                    <tr>
                                        <th className="opacity-50">Club</th>
                                        <td>{player.club}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Accordion.Panel>
                    </Accordion.Item>
                </div>
            ))}
        </Accordion>
    )
}

export default PlayerList;