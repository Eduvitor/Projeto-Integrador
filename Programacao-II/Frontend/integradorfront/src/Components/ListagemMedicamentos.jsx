

import React from 'react';

// Exemplo de dados. Em um aplicativo real, isso pode vir de uma API ou do estado do componente.
const items = [
    { id: 1, name: 'Item 1', description: 'Descrição do Item 1' },
    { id: 2, name: 'Item 2', description: 'Descrição do Item 2' },
    { id: 3, name: 'Item 3', description: 'Descrição do Item 3' },
    { id: 4, name: 'Item 4', description: 'Descrição do Item 4' },
    // Adicione mais itens conforme necessário
];

const ListagemItens = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Listagem de Itens</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                        <p className="text-gray-700">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListagemItens;
