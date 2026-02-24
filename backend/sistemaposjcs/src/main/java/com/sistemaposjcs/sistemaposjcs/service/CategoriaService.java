package com.sistemaposjcs.sistemaposjcs.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.sistemaposjcs.sistemaposjcs.model.Categoria;
import com.sistemaposjcs.sistemaposjcs.repository.CategoriaRepository;

@Service
public class CategoriaService {
    private final  CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

// ✅ Obtener categoria por ID
    public Categoria getCategoriaById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrado"));
    }

    public List<Categoria> getCategorias() {
        return categoriaRepository.findAll();
    }

// ✅ Crear categoria
    public Categoria createCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
// ✅ Actualizar categoria
    public Categoria updateCategoria(Long id, Categoria categoriaDetails) {
        Categoria categoria = getCategoriaById(id);

        categoria.setNombre(categoriaDetails.getNombre());

        return categoriaRepository.save(categoria);
    }
}

