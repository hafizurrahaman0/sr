// --- MOCK DATA GENERATION ---
const types = ['Residential', 'Commercial', 'Kitchen', 'Bathroom'];

function getRandomDate() {
    return new Date(Date.now() - Math.floor(Math.random() * 63000000000)).toISOString().split('T')[0];
}

export const projects = Array.from({ length: 32 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
        id: i + 1,
        title: `${type} Project ${i + 1}`,
        type: type,
        date: getRandomDate(),
        // Using picsum with seed for consistent random images
        imageUrl: `https://picsum.photos/seed/${i + 100}/600/400`
    };
});
