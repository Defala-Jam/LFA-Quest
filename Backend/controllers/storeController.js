import dbPromise from "../db.js";

export const buyItem = async (req, res) => {
  try {
    const { item_name, type, cost } = req.body;
    const db = await dbPromise;

    const user = await db.get("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (user.diamonds < cost) return res.status(400).json({ message: "Diamantes insuficientes" });

    await db.run("UPDATE users SET diamonds = diamonds - ? WHERE id = ?", [cost, req.user.id]);
    await db.run("INSERT INTO purchases (user_id, item_name, type, cost) VALUES (?, ?, ?, ?)", [
      req.user.id,
      item_name,
      type,
      cost,
    ]);

    res.json({ message: "Compra realizada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
