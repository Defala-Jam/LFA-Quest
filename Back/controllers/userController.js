// Backend/controllers/userController.js
import dbPromise from "../db.js";

// 📘 Obtém o perfil do usuário
export const getUserProfile = async (req, res) => {
  try {
    const db = await dbPromise;
    const user = await db.get(
      `SELECT 
         id, 
         name, 
         email, 
         xp, 
         diamonds, 
         streak_count, 
         last_completed_date,
         selected_avatar,
         selected_background
       FROM users 
       WHERE id = ?`,
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Erro ao buscar perfil:", err);
    res.status(500).json({ error: err.message });
  }
};

// ⚡ Atualiza o XP do usuário
export const updateUserXP = async (req, res) => {
  try {
    const { xp } = req.body;
    const db = await dbPromise;

    await db.run("UPDATE users SET xp = ? WHERE id = ?", [xp, req.params.id]);
    res.json({ message: "XP atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🎨 Atualiza avatar e fundo do usuário
export const updateUserPreferences = async (req, res) => {
  try {
    const { selected_avatar, selected_background } = req.body;
    const db = await dbPromise;

    const result = await db.run(
      "UPDATE users SET selected_avatar = ?, selected_background = ? WHERE id = ?",
      [selected_avatar, selected_background, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updated = await db.get(
      "SELECT id, name, email, selected_avatar, selected_background FROM users WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "Preferências atualizadas com sucesso!",
      user: updated,
    });
  } catch (err) {
    console.error("❌ Erro ao atualizar preferências:", err);
    res.status(500).json({ error: err.message });
  }
};
