package model;
public class Usuario {
    public int id;
    public String nome;
    public String email;
    public String senhaHash;
    public boolean isAdmin;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getSenhaHash() {
		return senhaHash;
	}
	public void setSenhaHash(String senhaHash) {
		this.senhaHash = senhaHash;
	}
	public boolean isAdmin() {
		return isAdmin;
	}
	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}
}
