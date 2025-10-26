// controllers/lessonController.js
import dbPromise from "../db.js";

export const completeLesson = async (req, res) => {
  try {
    const { user_id, correct_answers, total_questions } = req.body;
    const db = await dbPromise;

    // Verifica se o usuário existe
    const user = await db.get("SELECT * FROM users WHERE id = ?", [user_id]);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Calcula recompensas (ajuste livre)
    const xpEarned = correct_answers * 10;
    const diamondsEarned = Math.floor(correct_answers / 2);

    // Atualiza o banco
    await db.run(
      "UPDATE users SET xp = xp + ?, diamonds = diamonds + ? WHERE id = ?",
      [xpEarned, diamondsEarned, user_id]
    );

    // Retorna novos valores
    const updated = await db.get("SELECT xp, diamonds FROM users WHERE id = ?", [user_id]);
    res.json({
      message: "Lição concluída com sucesso!",
      xp_earned: xpEarned,
      diamonds_earned: diamondsEarned,
      new_xp: updated.xp,
      new_diamonds: updated.diamonds,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
